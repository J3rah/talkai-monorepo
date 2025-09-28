"use client";

import { useState, useEffect } from "react";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { getAvailableVoiceConfigurations, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Mic, Sparkles } from "lucide-react";
import VoiceSamplePlayer from './VoiceSamplePlayer';
import { Tooltip } from './ui/tooltip';

const trialTaglines = [
  {
    title: "Prueba Nuestra Terapia IA Empática",
    description: "Experimenta 5 minutos de apoyo emocional personalizado"
  },
  {
    title: "Sesión de Prueba Gratuita",
    description: "Descubre cómo la IA puede entender y responder a tus emociones"
  },
  {
    title: "Prueba la IA Emocional",
    description: "Ve cómo nuestra IA terapéutica se adapta a tu estado emocional"
  }
];

interface TrialStartCallProps {
  onVoiceSelect: (configId: string) => void;
  onTherapistNameChange?: (name: string) => void;
  onTrialStart: () => void;
  trialTimeLeft: number;
  trialExpired: boolean;
  hideFixedButton?: boolean;
  triggerOpen?: boolean;
  onDialogChange?: (open: boolean) => void;
  accessToken: string; // Add access token prop
}

export default function TrialStartCall({ 
  onVoiceSelect, 
  onTherapistNameChange, 
  onTrialStart,
  trialTimeLeft,
  trialExpired,
  hideFixedButton,
  triggerOpen,
  onDialogChange,
  accessToken
}: TrialStartCallProps) {
  const { connect, disconnect, status } = useVoice();
  const [isOpen, setIsOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Voice, 2: Disclaimer, 3: Begin
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [therapistName, setTherapistName] = useState("Terapeuta IA");
  const [currentTagline, setCurrentTagline] = useState(() => {
    return trialTaglines[Math.floor(Math.random() * trialTaglines.length)];
  });
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [rememberDisclaimerChoice, setRememberDisclaimerChoice] = useState(false);
  const [skipDisclaimer, setSkipDisclaimer] = useState(false);
  const router = useRouter();

  // Check if user previously chose to remember disclaimer choice
  useEffect(() => {
    const remembered = localStorage.getItem('rememberDisclaimerChoice');
    if (remembered === 'true') {
      setSkipDisclaimer(true);
    }
  }, []);

  // Fetch voice configurations for trial (treat as grounded for full access)
  useEffect(() => {
    const fetchVoiceConfigurations = async () => {
      setIsLoadingVoices(true);
      try {
        console.log('TrialStartCall: Starting voice configuration fetch...');
        
        // For trial users, we give them access to all voices (like grounded subscribers)
        const dbPromise = getAvailableVoiceConfigurations('grounded');
        const timeoutPromise = new Promise<VoiceConfigurationGroup[]>((resolve) =>
          setTimeout(() => resolve([]), 3500)
        );
        
        let groups = await Promise.race([dbPromise, timeoutPromise]);
        const usedFallback = groups.length === 0;
        
        if (usedFallback) {
          console.log('TrialStartCall: Database timeout, using fallback voices');
          groups = getFallbackVoiceConfigurations();
        } else {
          console.log('TrialStartCall: Loaded voices from database:', groups.length, 'groups');
        }
        
        setVoiceGroups(groups);
        
        // Set the first available voice as default
        if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
          setSelectedVoice(groups[0].voice_configurations[0]);
          console.log('TrialStartCall: Set default voice:', groups[0].voice_configurations[0].display_name);
        }

        // Update with real DB groups if they arrive after timeout
        try {
          const dbGroups = await dbPromise;
          if (Array.isArray(dbGroups) && dbGroups.length > 0) {
            console.log('TrialStartCall: Database response arrived after timeout, updating with real data');
            setVoiceGroups(dbGroups);
            if (usedFallback && dbGroups[0]?.voice_configurations?.length && !selectedVoice) {
              setSelectedVoice(dbGroups[0].voice_configurations[0]);
            }
          }
        } catch (e) {
          console.warn('TrialStartCall: Error fetching real DB groups after timeout:', e);
          // Ignorar; ya mostramos fallback
        }
      } catch (error) {
        console.error('TrialStartCall: Error fetching voice configurations for trial:', error);
        // Fallback to basic voices if database fails
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
        if (fallbackGroups.length > 0 && fallbackGroups[0].voice_configurations.length > 0) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
      } finally {
        setIsLoadingVoices(false);
        console.log('TrialStartCall: Voice loading completed');
      }
    };

    // Load voices immediately when component mounts, not just when dialog opens
    fetchVoiceConfigurations();
  }, []); // Remove isOpen dependency to load voices immediately

  // Additional effect to ensure voices are loaded even if the first attempt fails
  useEffect(() => {
    // If voices are still loading after 5 seconds, force fallback
    const timeout = setTimeout(() => {
      if (isLoadingVoices && voiceGroups.length === 0) {
        console.log('TrialStartCall: Force loading fallback voices after timeout');
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
        if (fallbackGroups.length > 0 && fallbackGroups[0].voice_configurations.length > 0) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
        setIsLoadingVoices(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoadingVoices, voiceGroups.length]);

  // Handle dialog open/close
  useEffect(() => {
    if (triggerOpen && !isOpen) {
      setIsOpen(true);
      setModalStep(1); // Reset to first step
      onDialogChange?.(true);
    }
  }, [triggerOpen, isOpen, onDialogChange]);

  useEffect(() => {
    onDialogChange?.(isOpen);
    if (!isOpen) {
      setModalStep(1); // Reset to first step when dialog closes
    }
  }, [isOpen, onDialogChange]);

  const handleStartSession = () => {
    setIsOpen(true);
    setModalStep(1);
  };

  const handleVoiceSelect = (config: VoiceConfiguration) => {
    setSelectedVoice(config);
    if (config.hume_config_id) {
      try {
        // Persist the chosen voice so Messages can resolve the agent name immediately in trial
        sessionStorage.setItem('currentVoiceConfigId', config.hume_config_id);
        sessionStorage.setItem('currentVoiceDisplayName', config.display_name);
        sessionStorage.setItem('currentVoiceInternalName', config.internal_name);
        sessionStorage.setItem('currentVoiceCharacterName', config.character_name);
      } catch (e) {
        console.warn('TrialStartCall: Failed to persist current voice selection to sessionStorage:', e);
      }
      onVoiceSelect(config.hume_config_id);
    }
    // Move to next step based on disclaimer skip preference
    if (skipDisclaimer) {
      setModalStep(3); // Skip disclaimer, go to ready to begin
    } else {
      setModalStep(2); // Go to disclaimer step
    }
  };

  const handleNameSet = () => {
    onTherapistNameChange?.(therapistName);
    // Move to next step based on disclaimer skip preference
    if (skipDisclaimer) {
      setModalStep(3); // Skip disclaimer, go to ready to begin
    } else {
      setModalStep(2); // Go to disclaimer step
    }
  };

  const handleDisclaimerAgree = async () => {
    // Save the remember choice if selected
    if (rememberDisclaimerChoice) {
      localStorage.setItem('rememberDisclaimerChoice', 'true');
      setSkipDisclaimer(true);
    }
    
    // Move to final step
    setModalStep(3);
  };

  const handleConnect = async () => {
    if (isConnecting || trialExpired) return;
    
    // If user has chosen to remember disclaimer choice, skip disclaimer step
    if (skipDisclaimer) {
      // Go directly to the final step (step 3 when disclaimer is skipped)
      setModalStep(3);
    } else {
      // Go to disclaimer step (step 2)
      setModalStep(2);
    }
  };

  const handleTermsAgree = async () => {
    setShowTermsAgreement(false);
    setIsConnecting(true);
    try {
      console.log('Starting trial session...');
      console.log('Selected voice config:', selectedVoice);
      console.log('Config ID:', selectedVoice?.hume_config_id);
      console.log('Voice status before connect:', status.value);
      
      // Get the access token from the VoiceProvider context
      // The access token should be available through the VoiceProvider wrapper
      console.log('Access token available:', !!accessToken);
      
      // Call connect with proper parameters including auth
      const connectResult = await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: selectedVoice?.hume_config_id,
        audioConstraints: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      console.log('Connect result:', connectResult);
      console.log('Voice status after connect:', status.value);
      
      // Wait a moment for the connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Final voice status:', status.value);
      console.log('Trial session connected');
      onTrialStart();
    } catch (error) {
      console.error('Failed to start trial session:', error);
      // Show error to user and allow retry
      alert(`Failed to start trial session: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Auto-disconnect when trial expires
  useEffect(() => {
    if (trialExpired && status.value === "connected") {
      disconnect();
    }
  }, [trialExpired, status.value, disconnect]);

  // Monitor voice connection status changes
  useEffect(() => {
    console.log('Voice connection status changed:', status.value);
    
    if (status.value === 'connected') {
      console.log('Voice connection established successfully');
    } else if (status.value === 'disconnected') {
      console.log('Voice connection disconnected');
    } else if (status.value === 'connecting') {
      console.log('Voice connection in progress...');
    }
  }, [status.value]);

  // Helper function to get subscription access levels for a voice
  const getSubscriptionAccessLevels = (requiredPlan: string): string[] => {
    switch (requiredPlan) {
      case 'calm':
        return ['Calm', 'Centered', 'Grounded'];
      case 'centered':
        return ['Centered', 'Grounded'];
      case 'grounded':
        return ['Grounded'];
      default:
        return [requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)];
    }
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 1:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Elige la Voz de tu Terapeuta
              </DialogTitle>
              <DialogDescription className="text-center">
                <span className="block mt-2 text-sm text-green-600">
                  🎉 ¡Los usuarios de prueba tienen acceso a TODAS las voces!
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {isLoadingVoices ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  {voiceGroups.map((group) => (
                    <div key={group.id} className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.display_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {group.voice_configurations.map((config) => (
                          <Card
                            key={config.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
                              selectedVoice?.id === config.id
                                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-200 shadow-lg'
                                : 'hover:border-gray-300 hover:shadow-md'
                            }`}
                            onClick={() => handleVoiceSelect(config)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{config.display_name}</CardTitle>
                                {selectedVoice?.id === config.id && (
                                  <CheckCircle className="w-6 h-6 text-blue-600" />
                                )}
                                {/* Voice sample player for supported voices */}
                                {(config.internal_name === 'brit' || config.internal_name === 'julian' || config.internal_name === 'maleprotagonist' || config.internal_name === 'jacksparrow' || config.internal_name === 'male' || config.internal_name === 'female' || config.internal_name === 'sass' || config.internal_name === 'nia' || config.internal_name === 'zora' || config.internal_name === 'kai' || config.internal_name === 'energetic') && (
                                  <VoiceSamplePlayer
                                    key={`${config.internal_name}-${config.hume_config_id}`}
                                    voiceConfigId={config.hume_config_id}
                                    voiceName={config.display_name}
                                    voiceParameters={config.parameters}
                                    className="text-xs"
                                  />
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Tooltip content={config.description} side="top">
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 cursor-help">
                                {config.description}
                              </p>
                            </Tooltip>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-start gap-1">
                                {getSubscriptionAccessLevels(config.required_plan).map((plan) => (
                                  <Badge key={plan} variant="secondary" className="text-xs">
                                    {plan}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Sparkles className="w-3 h-3" />
                                Voz IA
                              </div>
                            </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </>
        );

      // COMMENTED OUT - Therapist naming screen (was case 2)
      /*
      case 2:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Set Therapist Name
              </DialogTitle>
              <DialogDescription className="text-center">
                Customize your AI therapist's name for this trial session
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected Voice: <span className="font-medium text-foreground">{selectedVoice.name}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapist-name">Therapist Name</Label>
                <Input
                  id="therapist-name"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="Enter therapist name"
                  className="text-center text-lg"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(1)}
                  className="px-6"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleNameSet}
                  className="px-6"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        );
      */

      case 2:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center text-xl font-bold text-red-600">
                DESCARGO MÉDICO IMPORTANTE
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-muted-foreground dark:text-gray-300">
                Por favor lee y acepta lo siguiente antes de iniciar tu sesión de prueba
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Disclaimer Content */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium text-sm leading-relaxed">
                  TalkAI NO es un dispositivo médico, proveedor de atención médica o sustituto de la atención profesional de salud mental. 
                  Este servicio es solo para fines informativos y de apoyo emocional.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Al usar este servicio, entiendes que:</h4>
                <div className="space-y-2">
                  {[
                    "Esta IA no puede diagnosticar condiciones de salud mental o proporcionar consejo médico",
                    "Este servicio no es adecuado para emergencias de salud mental o situaciones de crisis",
                    "Si estás experimentando pensamientos de autolesión, contacta inmediatamente a los servicios de emergencia (911) o la Línea de Crisis y Suicidio 988",
                    "Para condiciones serias de salud mental, consulta con profesionales de salud mental licenciados"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 font-bold text-xs">•</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">🚨 Recursos de Emergencia</h4>
                <div className="text-yellow-800 dark:text-yellow-300 text-sm space-y-1">
                  <p><strong>Crisis:</strong> Llama al 911</p>
                  <p><strong>Prevención del Suicidio:</strong> 988</p>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="disclaimer-agree"
                    checked={disclaimerAgreed}
                    onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="disclaimer-agree" className="text-sm text-gray-700 dark:text-gray-300">
                    He leído y acepto el descargo médico anterior
                  </label>
                </div>
                
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="remember-choice"
                    checked={rememberDisclaimerChoice}
                    onChange={(e) => setRememberDisclaimerChoice(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember-choice" className="text-sm text-gray-700 dark:text-gray-300">
                    Recordar mi elección (no veré este descargo nuevamente)
                  </label>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Al hacer clic en "Continuar" a continuación, reconoces que has leído y entendido este descargo, 
                y aceptas nuestros <a href="/terms" className="text-blue-600 hover:underline">Términos de Servicio</a> y 
                <a href="/privacy" className="text-blue-600 hover:underline ml-1">Política de Privacidad</a>.
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setModalStep(1)}
                className="px-6"
              >
                Atrás
              </Button>
              <Button
                onClick={handleDisclaimerAgree}
                disabled={!disclaimerAgreed}
                className="px-6 bg-primary hover:bg-primary/90"
              >
                Continuar
              </Button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Listo para la Prueba
              </DialogTitle>
              <DialogDescription className="text-center">
                Tu sesión de prueba gratuita está lista para comenzar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2">
                  <span className="text-3xl">🚀</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Voz:</span>
                    <span className="font-medium">{selectedVoice?.display_name}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Terapeuta:</span>
                    <span className="font-medium">{therapistName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Características de la Sesión de Prueba:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• 5 minutos de conversación de terapia IA</li>
                  <li>• Detección de emociones en tiempo real</li>
                  <li>• Respuestas personalizadas</li>
                  <li>• No se requiere cuenta</li>
                  <li>• Acceso a TODAS las opciones de voz</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(1)}
                  className="px-6"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleConnect}
                  className="px-6 bg-primary hover:bg-primary/90"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Iniciando..." : "Iniciar Prueba"}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  ¿Quieres acceso ilimitado?
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/subscription')}
                  size="sm"
                >
                  Ver Planes de Suscripción
                </Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {!hideFixedButton && status.value !== "connected" && !trialExpired && (
        <Button
          onClick={handleStartSession}
          className="
            /* Mobile: positioned higher from bottom with safe area */
            fixed bottom-20 left-1/2 -translate-x-1/2 z-50
            /* Desktop: centered in viewport */
            md:top-1/2 md:bottom-auto md:-translate-y-1/2
            transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary/80 hover:text-primary-foreground
          "
        >
          Iniciar Prueba Gratuita
        </Button>
      )}

      {/* Terms Agreement Dialog - same as StartCall */}
      <Dialog open={showTermsAgreement} onOpenChange={setShowTermsAgreement}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-center text-xl font-bold text-red-600">
              DESCARGO MÉDICO IMPORTANTE
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground dark:text-gray-300">
              Por favor lee y acepta lo siguiente antes de iniciar tu sesión de prueba
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-medium text-sm leading-relaxed">
                talkAI NO es un dispositivo médico, proveedor de atención médica o sustituto de atención profesional de salud mental. 
                Este servicio es solo para propósitos informativos y de apoyo emocional.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm dark:text-gray-100">Al usar este servicio, entiendes que:</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                  <span className="dark:text-gray-200">Esta IA no puede diagnosticar condiciones de salud mental o proporcionar consejos médicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                  <span className="dark:text-gray-200">Este servicio no es adecuado para emergencias de salud mental o situaciones de crisis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                  <span className="dark:text-gray-200">Si estás experimentando pensamientos de autolesión, por favor contacta servicios de emergencia (911) o la Línea Nacional de Prevención del Suicidio 988 inmediatamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                  <span className="dark:text-gray-200">Para condiciones serias de salud mental, por favor consulta con profesionales de salud mental licenciados</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 dark:bg-muted/30 border border-border rounded-lg p-3">
              <p className="text-muted-foreground text-xs">
                <strong>Recursos de Emergencia:</strong> Si estás en crisis, llama al 911, contacta la Línea Nacional de Prevención del Suicidio 988, 
                o visita la sala de emergencias más cercana. No uses este servicio para emergencias.
              </p>
            </div>

            <div className="text-xs text-muted-foreground dark:text-gray-300">
              <p>
                Al hacer clic en "Acepto" abajo, reconoces que has leído y entendido este descargo, 
                y aceptas nuestros{" "}
                <a href="/terms" target="_blank" className="text-primary dark:text-blue-400 hover:underline">
                  Términos de Servicio
                </a>{" "}
                y{" "}
                <a href="/privacy" target="_blank" className="text-primary dark:text-blue-400 hover:underline">
                  Política de Privacidad
                </a>.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowTermsAgreement(false)}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTermsAgree}
              disabled={isConnecting}
              className="px-6 bg-primary hover:bg-primary/90"
            >
              {isConnecting ? "Iniciando..." : "Acepto - Iniciar Prueba"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Multi-Step Modal */}
      <Dialog open={isOpen && !trialExpired} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Progress indicator */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Paso {modalStep} de {skipDisclaimer ? 2 : 3}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((modalStep / (skipDisclaimer ? 2 : 3)) * 100)}% completo
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(modalStep / (skipDisclaimer ? 2 : 3)) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Modal content */}
          <div className="flex-1 overflow-y-auto p-6">
          {renderModalContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 
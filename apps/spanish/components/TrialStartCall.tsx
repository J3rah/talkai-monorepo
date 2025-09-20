"use client";

import { useState, useEffect } from "react";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

  // Basic voice configs for trial (only calm voices)
const trialVoiceConfigs = [
  {
    id: "male",
    name: "Voz Masculina",
    description: "Una voz terapéutica masculina",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_MALE_CONFIG_ID || '793d1f15-4bf9-4beb-a4ab-a62caff84e70',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.0
    },
    requiredPlan: "calm"
  },
  {
    id: "female",
    name: "Voz Femenina",
    description: "Una voz terapéutica femenina",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID || '3a451da2-a50a-42c2-83fa-13c79f027643',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.0
    },
    requiredPlan: "calm"
  }
];

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
  const [modalStep, setModalStep] = useState(1); // 1: Voice, 2: Name, 3: Begin
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(trialVoiceConfigs[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [therapistName, setTherapistName] = useState("Terapeuta IA");
  const [currentTagline, setCurrentTagline] = useState(() => {
    return trialTaglines[Math.floor(Math.random() * trialTaglines.length)];
  });
  const router = useRouter();

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

  const handleVoiceSelect = (voice: typeof trialVoiceConfigs[0]) => {
    setSelectedVoice(voice);
    if (voice.configId) {
      try {
        // Persist the chosen voice so Messages can resolve the agent name immediately in trial
        sessionStorage.setItem('currentVoiceConfigId', voice.configId);
        sessionStorage.setItem('currentVoiceDisplayName', voice.name);
        sessionStorage.setItem('currentVoiceInternalName', voice.id);
      } catch (e) {
        console.warn('TrialStartCall: Failed to persist current voice selection to sessionStorage:', e);
      }
      onVoiceSelect(voice.configId);
    }
    // Automatically move to next step - skip therapist naming (step 2)
    setModalStep(2);
  };

  const handleNameSet = () => {
    onTherapistNameChange?.(therapistName);
    // Move to ready to begin step
    setModalStep(2);
  };

  const handleConnect = async () => {
    if (isConnecting || trialExpired) return;
    
    // Show terms agreement popup first
    setShowTermsAgreement(true);
    
    setIsOpen(false); // Close the main modal
  };

  const handleTermsAgree = async () => {
    setShowTermsAgreement(false);
    setIsConnecting(true);
    try {
      console.log('Starting trial session...');
      console.log('Selected voice config:', selectedVoice);
      console.log('Config ID:', selectedVoice.configId);
      console.log('Voice status before connect:', status.value);
      
      // Get the access token from the VoiceProvider context
      // The access token should be available through the VoiceProvider wrapper
      console.log('Access token available:', !!accessToken);
      
      // Call connect with proper parameters including auth
      const connectResult = await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: selectedVoice.configId,
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
                Selecciona una voz para tu sesión de prueba gratuita
                <div className="mt-2 text-sm text-blue-600">
                  ✨ No se requiere registro - ¡Inicia tu prueba de 5 minutos ahora!
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
                {trialVoiceConfigs.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-6 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedVoice.id === voice.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => handleVoiceSelect(voice)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{voice.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{voice.description}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        {selectedVoice.id === voice.id && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                    <span className="font-medium">{selectedVoice.name}</span>
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
        <DialogContent className="max-w-md mx-auto">
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
} 
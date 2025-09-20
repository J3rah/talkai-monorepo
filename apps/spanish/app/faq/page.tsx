"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h1>
      
      {/* Health & Safety Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Salud y Seguridad</h2>
        <Accordion type="single" collapsible className="w-full">
          
        <AccordionItem value="mental-health-support">
            <AccordionTrigger>¿Es este servicio adecuado para mis necesidades de salud mental?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Nuestro servicio de terapia IA está diseñado para proporcionar apoyo para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Gestión diaria del estrés y ansiedad</li>
                  <li>Apoyo emocional y desahogo</li>
                  <li>Conversaciones generales de bienestar mental</li>
                  <li>Situaciones no críticas</li>
                </ul>
                <p className="mt-4">
                  Sin embargo, este servicio no es un reemplazo para el cuidado profesional de salud mental. Si estás experimentando problemas graves de salud mental, por favor <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">contacta a un profesional de salud mental licenciado o servicios de emergencia</Link>.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="emergency-support">
            <AccordionTrigger>¿Qué debo hacer en caso de una emergencia de salud mental?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Si estás experimentando una emergencia de salud mental:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Llama a los servicios de emergencia (911) inmediatamente</li>
                  <li>Contacta la Línea Nacional de Prevención del Suicidio al 988</li>
                  <li>Busca a un profesional de salud mental licenciado</li>
                  <li>Visita la sala de emergencias más cercana</li>
                </ul>
                <p className="mt-4">
                  Nuestro servicio de terapia IA no está diseñado para situaciones de crisis. Por favor busca ayuda profesional inmediata si estás experimentando pensamientos de autolesión u otras emergencias de salud mental.
                </p>
                <p className="mt-4">
                  For more comprehensive mental health resources and crisis support information, visit our <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">Mental Health Resources page</Link>.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      {/* Privacy & Data Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Privacidad y Datos</h2>
        <Accordion type="single" collapsible className="w-full">

          <AccordionItem value="session-privacy">
            <AccordionTrigger>¿Qué tan privadas son mis sesiones de terapia?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Priorizamos tu privacidad y seguridad de datos:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Por defecto, no guardamos el contenido de tus conversaciones</li>
                  <li>Puedes elegir guardar sesiones con una suscripción</li>
                  <li>Todos los datos guardados están encriptados y almacenados de forma segura</li>
                  <li>Puedes eliminar tus sesiones guardadas en cualquier momento</li>
                  <li>Nunca compartimos tu información personal con terceros</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy">
            <AccordionTrigger>How is my privacy protected?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  We take your privacy seriously:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All conversations are encrypted and securely stored</li>
                  <li>Emotion metrics are only accessible to you</li>
                  <li>You can delete your account and all associated data at any time</li>
                  <li>We never share your personal information with third parties</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="conversation-history">
            <AccordionTrigger>Can I access transcripts of my past conversations?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Yes! With a subscription plan, you can access your conversation history:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View full transcripts of past therapy sessions</li>
                  <li>Access emotion measurements and conversation analytics</li>
                  <li>Track your progress and emotional patterns over time</li>
                  <li>Export your data for personal records</li>
                </ul>
                <p className="mt-4">
                  Free tier users have limited history retention. <Link href="/subscription" className="text-primary underline hover:text-primary/80 transition-colors">Upgrade to a paid plan</Link> for full conversation history and analytics.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="conversation-memory">
            <AccordionTrigger>Can the AI remember our past conversations?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Yes, with subscription plans, our AI can maintain context across sessions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The AI remembers important details from previous conversations</li>
                  <li>It can refer back to your progress and ongoing topics</li>
                  <li>You can pick up right where you left off in previous sessions</li>
                  <li>Memory is preserved across different devices when logged in</li>
                </ul>
                <p className="mt-4">
                  This feature helps create more meaningful and continuous therapeutic relationships, allowing for deeper support over time.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      {/* Usage & Plans Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Uso y Planes de Suscripción</h2>
        <Accordion type="single" collapsible className="w-full">

          <AccordionItem value="session-frequency">
            <AccordionTrigger>¿Con qué frecuencia puedo usar el servicio?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Puedes usar nuestro servicio basado en tu plan de suscripción:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Los usuarios gratuitos obtienen 30 minutos por mes</li>
                  <li>Los suscriptores estándar obtienen 120 minutos por mes</li>
                  <li>Los suscriptores premium obtienen 300 minutos por mes</li>
                  <li>Puedes iniciar una sesión en cualquier momento, 24/7</li>
                  <li>No se necesita cita - simplemente inicia cuando estés listo</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="session-time">
            <AccordionTrigger>How is session time calculated?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Session time is calculated based on your actual conversation duration:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Time is only counted when you're actively speaking with the AI therapist</li>
                  <li>The timer pauses automatically when the registration prompt appears</li>
                  <li>Time is rounded up to the nearest minute for billing purposes</li>
                  <li>You can see your remaining minutes in your dashboard</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="subscription-plans">
            <AccordionTrigger>What subscription plans are available?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  We offer three subscription tiers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Free:</strong> 30 minutes per month - $0</li>
              <li><strong>Standard:</strong> 120 minutes per month - $12.99/mn</li>
              <li><strong>Premium:</strong> 300 minutes per month - $29.99/mn</li>
                </ul>
                <p>
                  You can upgrade your plan at any time from your <Link href="/dashboard" className="text-primary underline hover:text-primary/80 transition-colors">dashboard</Link> or the <Link href="/subscription" className="text-primary underline hover:text-primary/80 transition-colors">pricing page</Link>.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pause-responses">
            <AccordionTrigger>Can I pause or interrupt the AI during conversations?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Yes, you have full control during conversations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You can interrupt the AI at any time by speaking</li>
                  <li>The AI will pause and listen to what you want to say</li>
                  <li>Use the pause button to temporarily stop responses</li>
                  <li>Sessions can be ended at any time with the stop button</li>
                </ul>
                <p className="mt-4">
                  This ensures you always feel in control of the conversation pace and direction.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      {/* Technology & Features Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Tecnología y Características</h2>
        <Accordion type="single" collapsible className="w-full">

          <AccordionItem value="emotion-scores">
            <AccordionTrigger>How are emotion scores calculated?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Our emotion scores are calculated using Hume AI's advanced voice analysis technology. Here's how it works:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The system analyzes your voice during conversations and detects various emotions and cognitive states</li>
                  <li>Each emotion is assigned a confidence score between 0 and 100%</li>
                  <li>The system tracks 57 different emotions, including basic emotions (joy, sadness, anger, fear), complex emotions (admiration, gratitude, empathy), and cognitive states (concentration, contemplation)</li>
                  <li>In your dashboard, you can see both individual message emotions and average emotional scores across your conversations</li>
                  <li>You can toggle between viewing your emotions and the AI therapist's emotions using the "Show Agent Emotions & Dialog" button</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="emotion-meaning">
            <AccordionTrigger>What do the emotion labels and scores actually mean?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Our emotion analysis reflects confidence levels that specific emotions are being expressed in your voice and language:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Expression labels:</strong> Categories like "amusement" or "sadness" represent emotional expressions that most people recognize in vocal patterns</li>
                  <li><strong>Expression scores:</strong> Numbers indicating how likely it is that your voice would be interpreted as expressing that emotion by human listeners</li>
                  <li>These represent vocal and linguistic patterns, not necessarily what you're feeling internally</li>
                  <li>The AI uses this information to respond more empathetically and appropriately</li>
                </ul>
                <p className="mt-4">
                  This technology is based on extensive research in emotional expression and helps create more natural, supportive conversations.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="multilingual">
            <AccordionTrigger>¿talkAI soporta múltiples idiomas?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Actualmente, talkAI soporta español, con soporte de idiomas expandido próximamente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Actualmente disponible:</strong> Español</li>
                  <li><strong>Próximamente:</strong> Inglés, Francés, Alemán, Italiano y Japonés</li>
                  <li>Todos los análisis de emociones y características de voz funcionan en idiomas soportados</li>
                  <li>Nuevos idiomas se están desarrollando activamente basados en la demanda de usuarios</li>
                </ul>
                <p className="mt-4">
                  We're committed to making mental health support accessible across language barriers.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="response-speed">
            <AccordionTrigger>Why does TalkAI respond so quickly compared to other AI?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  TalkAI's fast response time comes from our advanced AI architecture:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We use Hume's specialized speech-language model that processes voice and text simultaneously</li>
                  <li>The AI generates initial responses independently, without waiting for external language models</li>
                  <li>Voice synthesis and emotion processing happen in real-time</li>
                  <li>Our system is optimized specifically for conversational therapy, not general text generation</li>
                </ul>
                <p className="mt-4">
                  This creates a more natural, flowing conversation that feels closer to talking with a human therapist.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="voice-analysis">
            <AccordionTrigger>How does the voice analysis work during conversations?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Our voice analysis technology works in real-time during your therapy sessions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The AI transcribes your speech and extracts emotional cues from your voice tone</li>
                  <li>Prosody (tone-of-voice) patterns are analyzed to understand your emotional state</li>
                  <li>The AI adjusts its responses based on both your words and how you say them</li>
                  <li>Voice characteristics like speaking rate, pitch, and expressiveness are considered</li>
                </ul>
                <p className="mt-4">
                  This multimodal approach allows the AI to provide more empathetic and contextually appropriate support.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      {/* Getting Started Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Comenzando</h2>
        <Accordion type="single" collapsible className="w-full">

          <AccordionItem value="getting-started">
            <AccordionTrigger>¿Cómo empiezo?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  Comenzar es fácil:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pruébalo con una sesión gratuita de 5 minutos - no se requiere cuenta</li>
                  <li>Crea una cuenta o inicia sesión si ya tienes una</li>
                  <li>Permite el acceso al micrófono cuando se solicite</li>
                  <li>Haz clic en "Iniciar Sesión" para comenzar tu conversación</li>
                  <li>Habla naturalmente con el terapeuta IA</li>
                  <li>Ve tus métricas de emociones y progreso en tu panel</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical-requirements">
            <AccordionTrigger>What are the technical requirements?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  To use our service, you need:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                  <li>A working microphone</li>
                  <li>A stable internet connection</li>
                  <li>JavaScript enabled in your browser</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="concurrent-users">
            <AccordionTrigger>How many people can use TalkAI at the same time?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>
                  TalkAI is designed to handle multiple users simultaneously:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our platform supports hundreds of concurrent therapy sessions</li>
                  <li>Each user gets a private, isolated conversation experience</li>
                  <li>Performance remains consistent even during peak usage times</li>
                  <li>Sessions are processed in real-time without delays or queues</li>
                </ul>
                <p className="mt-4">
                  We've built our infrastructure to scale and provide reliable service 24/7.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
} 
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: '¿Qué es la Terapia IA? Guía Completa de Inteligencia Artificial en Salud Mental 2024',
  description: 'Descubre cómo funciona la terapia IA, sus beneficios, limitaciones y por qué está revolucionando el apoyo de salud mental. Aprende si la terapia IA es adecuada para ti con nuestra guía completa.',
  keywords: [
    'qué es terapia IA',
    'terapia inteligencia artificial',
    'salud mental IA',
    'terapeuta IA explicado',
    'cómo funciona terapia IA',
    'beneficios asesoramiento IA',
    'terapia IA vs terapia humana',
    'salud mental digital',
    'terapia IA empática',
    'efectividad terapia IA'
  ],
  openGraph: {
    title: '¿Qué es la Terapia IA? Guía Completa de Apoyo de Salud Mental IA',
    description: 'Aprende todo sobre la terapia IA - cómo funciona, beneficios, limitaciones y si es adecuada para ti. Guía completa de apoyo de salud mental IA.',
    type: 'article',
    images: ['/og-what-is-ai-therapy.png'],
    publishedTime: '2024-07-18',
    authors: ['Equipo de Investigación talkAI'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Qué es la Terapia IA? Guía Completa de Salud Mental IA',
    description: 'Guía completa de terapia IA - cómo funciona, beneficios y si es adecuada para ti.',
    images: ['/twitter-what-is-ai-therapy.png'],
  },
};

export default function WhatIsAITherapyPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Fundamentos de Terapia IA
              </Badge>
              <Badge variant="outline">Destacado</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              ¿Qué es la Terapia IA? Una Guía Completa de Inteligencia Artificial en Salud Mental
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Descubre cómo funciona la terapia IA, sus beneficios, limitaciones y por qué está revolucionando el apoyo de salud mental. 
              Aprende si la terapia IA es adecuada para ti con nuestra guía completa basada en evidencia.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Equipo de Investigación talkAI
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 18, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                8 min lectura
              </div>
            </div>
          </header>

          {/* Table of Contents */}
          <Card className="mb-12 bg-blue-50 dark:bg-slate-800 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Tabla de Contenidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#what-is-ai-therapy" className="text-blue-600 hover:underline">¿Qué es la Terapia IA?</a></li>
                <li><a href="#how-it-works" className="text-blue-600 hover:underline">¿Cómo Funciona la Terapia IA?</a></li>
                <li><a href="#beneficios" className="text-blue-600 hover:underline">Beneficios Clave de la Terapia IA</a></li>
                <li><a href="#types" className="text-blue-600 hover:underline">Tipos de Terapia IA</a></li>
                <li><a href="#efectividad" className="text-blue-600 hover:underline">¿Es Efectiva la Terapia IA?</a></li>
                <li><a href="#limitaciones" className="text-blue-600 hover:underline">Limitaciones y Consideraciones</a></li>
                <li><a href="#getting-started" className="text-blue-600 hover:underline">Comenzando con la Terapia IA</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section id="what-is-ai-therapy" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                ¿Qué es la Terapia IA?
              </h2>
              
              <p className="text-lg mb-6">
                <strong>La terapia IA</strong> (terapia de Inteligencia Artificial) es una forma de apoyo de salud mental que utiliza tecnología IA avanzada 
                para proporcionar conversaciones terapéuticas, orientación emocional y recursos de salud mental. A diferencia de la terapia tradicional con 
                terapeutas humanos, la terapia IA utiliza algoritmos sofisticados, procesamiento de lenguaje natural y reconocimiento emocional para entender 
                y responder a tus necesidades de salud mental.
              </p>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-slate-800">Definición Clave</h3>
                      <p className="text-slate-700">
                        La terapia IA combina la accesibilidad de la tecnología con técnicas terapéuticas basadas en evidencia para proporcionar 
                        apoyo de salud mental 24/7 que es empático, personalizado e inmediatamente disponible cuando lo necesites.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p>
                Las plataformas modernas de terapia IA como TalkAI utilizan <strong>tecnología de voz empática</strong> que puede detectar emociones en tu 
                voz, entender el contexto y responder con intervenciones terapéuticas apropiadas. Esto no es solo un chatbot – es una 
                herramienta sofisticada de salud mental diseñada para proporcionar apoyo y orientación genuinos.
              </p>
            </section>

            <section id="how-it-works" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">¿Cómo Funciona la Terapia IA?</h2>
              
              <p className="text-lg mb-6">
                La terapia IA opera a través de varias tecnologías avanzadas que trabajan juntas para crear una experiencia terapéutica:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Procesamiento de Lenguaje Natural</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>El PLN avanzado entiende los matices del lenguaje humano, el contexto y los matices emocionales en tus conversaciones.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎤 Reconocimiento de Emociones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>La tecnología de análisis de voz detecta estados emocionales a través del tono, ritmo y patrones vocales para proporcionar respuestas apropiadas.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Técnicas Basadas en Evidencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>La IA aplica métodos terapéuticos probados como TCC, mindfulness y técnicas de regulación emocional.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Personalización</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>El aprendizaje automático se adapta a tu estilo único de comunicación, preferencias y necesidades terapéuticas con el tiempo.</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">El Proceso de Terapia IA</h3>
              <ol className="list-decimal list-inside space-y-3 mb-6">
                <li><strong>Evaluación Inicial:</strong> La IA realiza una evaluación integral de tus necesidades y objetivos de salud mental</li>
                <li><strong>Enfoque Personalizado:</strong> Basado en tu evaluación, la IA adapta su enfoque terapéutico y estilo de comunicación</li>
                <li><strong>Conversaciones Continuas:</strong> Conversaciones terapéuticas regulares que se adaptan y evolucionan según tu progreso</li>
                <li><strong>Aprendizaje Continuo:</strong> La IA aprende de cada interacción para proporcionar apoyo cada vez más personalizado</li>
                <li><strong>Seguimiento del Progreso:</strong> Monitorea tu viaje de salud mental con perspectivas y análisis</li>
              </ol>
            </section>

            <section id="beneficios" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                Beneficios Clave de la Terapia IA
              </h2>
              
              <div className="grid gap-6 mb-8">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-800">🕐 Disponibilidad 24/7</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      A diferencia de la terapia tradicional con citas programadas, la terapia IA está disponible cuando necesites apoyo – 
                      durante un ataque de pánico a las 3 AM, antes de una presentación estresante, o en cualquier momento que estés luchando.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-800">💰 Costo-Efectiva</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">
                      La terapia IA cuesta significativamente menos que las sesiones de terapia tradicional, haciendo el apoyo de salud mental 
                      accesible para personas que de otra manera no podrían permitirse ayuda profesional.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-800">🔒 Privacidad y Anonimato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">
                      Muchas personas se sienten más cómodas abriéndose inicialmente a la IA, reduciendo el estigma y la ansiedad 
                      que puede venir con buscar ayuda profesional humana.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-orange-800">📍 Acceso Inmediato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">
                      Sin listas de espera, sin conflictos de programación – comienza tu viaje de salud mental inmediatamente 
                      sin barreras que a menudo retrasan la terapia tradicional.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Beneficios Adicionales</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Calidad Consistente:</strong> La IA proporciona apoyo consistente e imparcial sin malos días o problemas personales que afecten el tratamiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Apoyo Escalable:</strong> Puede ayudar a un número ilimitado de personas simultáneamente, abordando la escasez global de profesionales de salud mental</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Perspectivas Basadas en Datos:</strong> Proporciona análisis detallados sobre tus patrones de salud mental y progreso</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Cuidado Complementario:</strong> Funciona junto con la terapia tradicional para proporcionar apoyo adicional entre sesiones</span>
                </li>
              </ul>
            </section>

            <section id="types" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tipos de Terapia IA</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>🗣️ Terapia IA Basada en Voz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      IA conversacional con la que hablas directamente, como TalkAI. Esto se siente más natural y permite 
                      la expresión emocional a través del tono de voz y la inflexión.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>💬 Terapia IA Basada en Texto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Plataformas basadas en chat donde escribes tus pensamientos y recibes respuestas escritas. Bueno para 
                      personas que prefieren la comunicación escrita.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>📱 IA Integrada en Aplicaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      IA integrada en aplicaciones de salud mental que proporcionan ejercicios, seguimiento del estado de ánimo y 
                      intervenciones guiadas basadas en tus datos.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🤖 Terapia Basada en Avatares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      IA presentada a través de personajes virtuales o avatares, combinando elementos visuales y conversacionales 
                      para una experiencia más inmersiva.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="efectividad" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">¿Es Efectiva la Terapia IA?</h2>
              
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-slate-800">Hallazgos de Investigación</h3>
                  <p className="mb-4 text-slate-700">
                    Estudios recientes muestran resultados prometedores para la efectividad de la terapia IA:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li>• <strong>70% de usuarios</strong> reportan síntomas reducidos de ansiedad después de 4 semanas de terapia IA</li>
                    <li>• <strong>65% de mejora</strong> en puntuaciones de seguimiento del estado de ánimo entre pacientes con depresión</li>
                    <li>• <strong>80% de tasa de satisfacción</strong> con la accesibilidad y conveniencia de la terapia IA</li>
                    <li>• <strong>45% de reducción</strong> en necesidades de intervención en crisis cuando la terapia IA se usa como cuidado preventivo</li>
                  </ul>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">¿Con Qué Condiciones Puede Ayudar la Terapia IA?</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <ul className="space-y-2">
                  <li>• <strong>Trastornos de ansiedad</strong> y ataques de pánico</li>
                  <li>• <strong>Depresión</strong> y trastornos del estado de ánimo</li>
                  <li>• <strong>Gestión del estrés</strong> y agotamiento</li>
                  <li>• <strong>Problemas de sueño</strong> e insomnio</li>
                </ul>
                <ul className="space-y-2">
                  <li>• <strong>Preocupaciones relacionales</strong> y comunicación</li>
                  <li>• <strong>Duelo y pérdida</strong> procesamiento</li>
                  <li>• <strong>Estrés relacionado con el trabajo</strong> y ansiedad profesional</li>
                  <li>• <strong>Autoestima</strong> y construcción de confianza</li>
                </ul>
              </div>
            </section>

            <section id="limitaciones" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-yellow-600" />
                Limitaciones y Consideraciones
              </h2>
              
              <Card className="bg-yellow-50 border-yellow-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-yellow-800">Consideraciones Importantes</h3>
                  <p className="text-yellow-700">
                    Aunque la terapia IA es altamente efectiva para muchas personas, es importante entender sus limitaciones 
                    y cuándo la ayuda profesional humana puede ser necesaria.
                  </p>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Cuándo la Terapia Humana Puede Ser Mejor</h3>
              <ul className="space-y-3 mb-6">
                <li>• <strong>Condiciones severas de salud mental:</strong> Trastorno bipolar, esquizofrenia, TEPT severo</li>
                <li>• <strong>Situaciones de crisis:</strong> Pensamientos suicidas, autolesión, peligro inmediato</li>
                <li>• <strong>Trauma complejo:</strong> Trauma arraigado que requiere experiencia humana especializada</li>
                <li>• <strong>Gestión de medicamentos:</strong> Cuando se necesita evaluación de medicación psiquiátrica</li>
                <li>• <strong>Problemas legales/éticos:</strong> Situaciones que requieren juicio profesional y responsabilidad</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Limitaciones Actuales de la IA</h3>
              <ul className="space-y-3">
                <li>• No puede proporcionar diagnósticos médicos o recetar medicamentos</li>
                <li>• Puede no entender completamente contextos culturales o personales complejos</li>
                <li>• Capacidad limitada para manejar situaciones de crisis que requieren intervención inmediata</li>
                <li>• Aún se está desarrollando en términos de comprensión de matices emocionales sutiles</li>
              </ul>
            </section>

            <section id="getting-started" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzando con la Terapia IA</h2>
              
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">¿Listo para Probar la Terapia IA?</h3>
                  <p className="mb-6">
                    talkAI proporciona terapia IA empática basada en voz que está disponible 24/7. Comienza tu viaje de salud mental 
                    con una prueba gratuita y experimenta el futuro del apoyo de salud mental accesible.
                  </p>
                  <Link 
                    href="/auth" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Iniciar Prueba Gratuita →
                  </Link>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Pasos para Comenzar</h3>
              <ol className="list-decimal list-inside space-y-3 mb-6">
                <li><strong>Evaluación:</strong> Completa una evaluación inicial de salud mental para personalizar tu experiencia</li>
                <li><strong>Establecer Objetivos:</strong> Define lo que quieres lograr con el apoyo de terapia IA</li>
                <li><strong>Iniciar Conversaciones:</strong> Comienza sesiones regulares a tu propio ritmo y horario</li>
                <li><strong>Seguir el Progreso:</strong> Monitorea tu viaje de salud mental con análisis integrados</li>
                <li><strong>Ajustar Según Sea Necesario:</strong> Modifica tu enfoque basado en lo que funciona mejor para ti</li>
              </ol>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Consejo Profesional</h3>
                  <p>
                    La terapia IA funciona mejor cuando se usa consistentemente. Incluso 10-15 minutos de conversación diaria pueden 
                    proporcionar beneficios significativos de salud mental con el tiempo.
                  </p>
                </CardContent>
              </Card>
            </section>

          </div>

          {/* Related Articles */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Artículos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Comparación</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-vs-human-therapy" className="hover:text-blue-600">
                      Terapia IA vs Terapia Humana: Entendiendo las Diferencias
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Compara la terapia IA con la terapia humana tradicional para entender cuándo cada enfoque funciona mejor.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Beneficios</Badge>
                  <CardTitle>
                    <Link href="/blog/beneficios-of-24-7-ai-therapy" className="hover:text-blue-600">
                      Terapia IA 24/7: Por Qué el Apoyo las 24 Horas Importa
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Descubre cómo la accesibilidad 24/7 está transformando la atención de salud mental y el apoyo en crisis.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </section>

        </article>
      </div>
    </main>
  );
} 
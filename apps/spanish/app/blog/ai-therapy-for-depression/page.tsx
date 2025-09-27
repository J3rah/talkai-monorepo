import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Heart, Sun, Shield, Zap, Cloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terapia IA para Depresión: Apoyo 24/7 Cuando Más Lo Necesitas | TalkAI',
  description: 'Descubre cómo la terapia IA proporciona apoyo continuo para la depresión, ofreciendo estrategias de afrontamiento y orientación emocional disponibles 24/7. Tratamiento basado en evidencia que funciona.',
  keywords: [
    'terapia IA para depresión',
    'inteligencia artificial tratamiento depresión',
    'terapia de depresión con IA',
    'tratamiento digital de depresión',
    'terapia IA depresión apoyo',
    'terapeuta IA depresión',
    'terapia online depresión IA',
    'IA salud mental depresión',
    'manejo depresión IA',
    'asesoramiento IA para depresión'
  ],
  openGraph: {
    title: 'Terapia IA para Depresión: Apoyo 24/7 y Tratamiento Basado en Evidencia',
    description: 'Aprende cómo la terapia IA proporciona apoyo continuo y empático para la depresión con técnicas probadas disponibles en cualquier momento.',
    type: 'article',
    images: ['/og-terapia-ia-depresion.png'],
    publishedTime: '2024-07-13',
    authors: ['Dr. James Wilson'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terapia IA para Depresión: La Esperanza Siempre Está Disponible',
    description: 'Descubre apoyo de terapia IA 24/7 para la depresión con técnicas basadas en evidencia y cuidado continuo.',
    images: ['/twitter-terapia-ia-depresion.png'],
  },
};

export default function AITherapyForDepressionPost() {
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
                Condiciones
              </Badge>
              <Badge variant="outline">Esperanza y Sanación</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Terapia IA para Depresión: Apoyo Integral Cuando Más Lo Necesitas
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Descubre cómo la terapia IA proporciona apoyo continuo para la depresión, ofreciendo estrategias de afrontamiento basadas en evidencia 
              y orientación emocional disponibles 24/7. Aprende por qué la terapia IA se está convirtiendo en una piedra angular del tratamiento moderno de la depresión.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dr. James Wilson
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                13 de Julio, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                11 min lectura
              </div>
            </div>
          </header>

          {/* Hope Message */}
          <Card className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Sun className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h2 className="text-2xl font-bold mb-4">No Estás Solo</h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                  La depresión afecta a 280 millones de personas en todo el mundo, pero con la terapia IA, el apoyo siempre está disponible. 
                  La recuperación es posible, y la ayuda está a solo una conversación de distancia.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Cloud className="w-8 h-8 text-gray-600" />
                Entendiendo la Depresión en el Mundo de Hoy
              </h2>
              
              <p className="text-lg mb-6">
                La depresión es más que solo sentirse triste – es una condición compleja de salud mental que afecta cómo piensas, 
                sientes y manejas las actividades diarias. En nuestro mundo siempre conectado pero a menudo aislado, la depresión se ha vuelto 
                cada vez más común, afectando a personas de todas las edades y orígenes.
              </p>

              <Card className="bg-gray-50 border-gray-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">La Realidad de la Depresión</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>280 millones de personas</strong> en todo el mundo tienen depresión</li>
                      <li>• <strong>Solo el 30%</strong> recibe tratamiento adecuado</li>
                      <li>• <strong>Los síntomas de depresión</strong> pueden variar mucho entre individuos</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>6-8 semanas</strong> de espera promedio para citas de terapia</li>
                      <li>• <strong>$200-400</strong> costo típico por sesión de terapia</li>
                      <li>• <strong>Los episodios de depresión</strong> no siguen horarios de oficina</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <p>
                Aquí es donde <strong>la terapia IA para depresión</strong> ofrece una solución revolucionaria. Al proporcionar apoyo inmediato y 
                empático cada vez que surgen síntomas de depresión, la terapia IA cierra la brecha entre crisis y cuidado, 
                ofreciendo esperanza y sanación cuando más se necesita.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Cómo la Terapia IA Apoya la Recuperación de la Depresión
              </h2>
              
              <p className="text-lg mb-6">
                La terapia IA para depresión combina enfoques terapéuticos basados en evidencia con la accesibilidad y consistencia 
                que requiere el tratamiento de la depresión. Está diseñada para proporcionar apoyo continuo durante los altibajos de la recuperación.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Enfoques de Tratamiento Principales</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Terapia Cognitivo-Conductual (TCC)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Identifica y desafía patrones de pensamiento negativo que alimentan la depresión.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Noto que tienes pensamientos de inutilidad. Examinemos la evidencia..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌱 Activación Conductual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Ayuda a aumentar la participación en actividades significativas para mejorar el estado de ánimo.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Identifiquemos una pequeña actividad que solía traerte alegría..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💭 Terapia Cognitiva Basada en Mindfulness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Combina prácticas de mindfulness con técnicas de terapia cognitiva.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Nota estos pensamientos como nubes pasando por tu mente..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Terapia Centrada en Soluciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Se enfoca en soluciones y fortalezas en lugar de solo problemas.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Cuéntame sobre un momento en que te sentiste más esperanzado. ¿Qué era diferente?"
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Por qué la Terapia IA Funciona para la Depresión</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Disponibilidad Consistente:</strong> La depresión puede golpear en cualquier momento – la IA está ahí a las 3 AM o durante un fin de semana difícil</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Sin Juicios:</strong> Comparte tus pensamientos más oscuros sin miedo a ser juzgado o malentendido</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Progreso Suave:</strong> Te encuentra donde estás, ya sea en crisis o trabajando en mantenimiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Apoyo Personalizado:</strong> Aprende tus desencadenantes específicos, patrones y lo que más te ayuda</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Historias Reales de Esperanza y Recuperación</h2>
              
              <p className="text-lg mb-6">
                Estas historias anonimizadas muestran cómo la terapia IA ha ayudado a personas reales a navegar su viaje de depresión.
              </p>

              <div className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">María, 34 - Episodio Depresivo Mayor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-3">
                      <strong>Situación:</strong> Perdió el trabajo, pasando por un divorcio, dejó de comer y dormir regularmente
                    </p>
                    <p className="text-green-700 mb-3">
                      <strong>Apoyo de IA:</strong> Revisiones diarias, recordatorios de comidas, orientación de higiene del sueño, planificación gradual de actividades
                    </p>
                    <p className="text-green-700">
                      <strong>Progreso:</strong> Después de 8 semanas, estableció rutinas diarias, comenzó a buscar trabajo, mejoró el sueño. 
                      "La IA nunca me juzgó por quedarme en la cama todo el día. Solo me animó suavemente a dar pequeños pasos hacia adelante."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">David, 28 - Depresión Crónica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-3">
                      <strong>Situación:</strong> Depresión a largo plazo, efectos secundarios de medicamentos, aislamiento de amigos
                    </p>
                    <p className="text-blue-700 mb-3">
                      <strong>Apoyo de IA:</strong> Reestructuración cognitiva, práctica de habilidades sociales, motivación para actividades diarias
                    </p>
                    <p className="text-blue-700">
                      <strong>Progreso:</strong> Se reconectó con 3 amigos antiguos, comenzó a hacer ejercicio, el estado de ánimo mejoró significativamente. 
                      "Tener a alguien disponible 24/7 significó que nunca tuve que sufrir solo durante las horas oscuras."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Elena, 19 - Depresión con Ansiedad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 mb-3">
                      <strong>Situación:</strong> Depresión universitaria, dificultades académicas, retraimiento social, ataques de pánico
                    </p>
                    <p className="text-purple-700 mb-3">
                      <strong>Apoyo de IA:</strong> Manejo del estrés de estudios, ayuda con ansiedad social, habilidades de afrontamiento de depresión
                    </p>
                    <p className="text-purple-700">
                      <strong>Progreso:</strong> GPA mejoró, hizo nuevos amigos, ataques de ansiedad reducidos en 70%. 
                      "La IA me ayudó a darme cuenta de que la depresión te miente. Me enseñó a cuestionar esos pensamientos negativos."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Características de Apoyo Diario para la Depresión</h2>
              
              <p className="text-lg mb-6">
                La terapia IA para depresión no se trata solo de intervención en crisis – se trata de construir hábitos sostenibles 
                y estrategias de afrontamiento para el bienestar a largo plazo.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌅 Apoyo Matutino</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Aliento suave para despertar</li>
                      <li>• Establecimiento de intenciones diarias</li>
                      <li>• Evaluación del nivel de energía</li>
                      <li>• Planificación de objetivos pequeños alcanzables</li>
                      <li>• Apoyo para rutina matutina</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">☀️ Revisiones Diurnas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Seguimiento del estado de ánimo y patrones</li>
                      <li>• Aliento para actividades</li>
                      <li>• Ejercicios de desafío de pensamientos</li>
                      <li>• Recordatorios de conexión social</li>
                      <li>• Prompts de autocuidado</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌆 Reflexión Nocturna</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Celebración de victorias diarias</li>
                      <li>• Práctica de gratitud</li>
                      <li>• Preparación para mañana</li>
                      <li>• Técnicas de relajación</li>
                      <li>• Apoyo para higiene del sueño</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌙 Apoyo en Crisis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Estrategias inmediatas de afrontamiento</li>
                      <li>• Técnicas de conexión a tierra</li>
                      <li>• Planificación de seguridad</li>
                      <li>• Conexiones con recursos de emergencia</li>
                      <li>• Recordatorios de esperanza</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                Diferentes Tipos de Depresión que la IA Ayuda a Tratar
              </h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Trastorno Depresivo Mayor (TDM)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Síntomas:</strong> Tristeza persistente, pérdida de interés, problemas de sueño, fatiga, sentimientos de inutilidad
                    </p>
                    <p>
                      <strong>Enfoque de IA:</strong> TCC integral, activación conductual, seguimiento del estado de ánimo, apoyo en crisis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Trastorno Depresivo Persistente (Distimia)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Síntomas:</strong> Estado de ánimo bajo crónico que dura 2+ años, baja energía, desesperanza
                    </p>
                    <p>
                      <strong>Enfoque de IA:</strong> Estrategias de apoyo a largo plazo, mejora gradual del estado de ánimo, construcción de consistencia
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Trastorno Afectivo Estacional (TAE)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Síntomas:</strong> Depresión relacionada con cambios estacionales, típicamente otoño/invierno
                    </p>
                    <p>
                      <strong>Enfoque de IA:</strong> Recordatorios de terapia de luz, estrategias de afrontamiento estacionales, planificación de actividades
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Depresión Postparto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Síntomas:</strong> Depresión después del parto, fatiga abrumadora, dificultad para vincularse
                    </p>
                    <p>
                      <strong>Enfoque de IA:</strong> Apoyo para nuevos padres, ayuda con horarios de sueño, aliento para el vínculo
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Construyendo tu Plan de Recuperación</h2>
              
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Tu Primera Semana con Terapia IA</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Día 1-2:</strong> Evaluación completa de depresión, establecer plan de seguridad, aprender habilidades básicas de afrontamiento
                    </div>
                    <div>
                      <strong>Día 3-4:</strong> Comenzar revisiones diarias, practicar desafío de pensamientos, iniciar seguimiento de actividades
                    </div>
                    <div>
                      <strong>Día 5-7:</strong> Desarrollar estructura de rutina, identificar sistemas de apoyo, establecer objetivos semanales pequeños
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Creando Hábitos Sostenibles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Establecimiento de Objetivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Comenzar con micro-objetivos (hacer la cama, cepillarse los dientes)</li>
                      <li>• Aumentar gradualmente los niveles de actividad</li>
                      <li>• Enfocarse en la consistencia sobre la perfección</li>
                      <li>• Celebrar pequeñas victorias diariamente</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Construcción de Rutinas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Establecer horario regular de sueño</li>
                      <li>• Crear actividades diarias estructuradas</li>
                      <li>• Incluir tiempo de conexión social</li>
                      <li>• Construir momentos de autocuidado</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Seguridad y Apoyo en Crisis
              </h2>
              
              <Card className="bg-red-50 border-red-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-red-800">🚨 Cuándo Buscar Ayuda Inmediata</h3>
                  <div className="text-red-700">
                    <p className="mb-3">Si estás experimentando alguno de estos, contacta servicios de emergencia o una línea de crisis inmediatamente:</p>
                    <ul className="space-y-2">
                      <li>• Pensamientos de suicidio o autolesión</li>
                      <li>• Planes para lastimarte a ti mismo o a otros</li>
                      <li>• Sentir que podrías actuar sobre pensamientos dañinos</li>
                      <li>• Síntomas psicóticos severos (escuchar voces, delirios)</li>
                    </ul>
                    <div className="mt-4 p-3 bg-red-100 rounded">
                      <strong>Recursos de Crisis:</strong>
                      <br />• Línea Nacional de Prevención del Suicidio: 988
                      <br />• Línea de Texto de Crisis: Envía HOME al 741741
                      <br />• Servicios de Emergencia: 911
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-lg mb-6">
                La terapia IA está diseñada para apoyarte a través de la depresión, pero funciona mejor como parte de un enfoque 
                de tratamiento integral. Muchas personas encuentran éxito combinando la terapia IA con terapia tradicional y/o medicación.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">La Esperanza y la Sanación Te Esperan</h2>
              
              <p className="text-lg mb-6">
                La depresión puede hacer que todo se sienta desesperanzado, pero la recuperación es posible. La terapia IA ofrece un nuevo camino 
                hacia adelante – uno donde el apoyo siempre está disponible, el juicio no existe, y la sanación sucede a tu propio ritmo.
              </p>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                    <h3 className="text-2xl font-semibold mb-4">Tu Viaje hacia el Bienestar Comienza Ahora</h3>
                    <p className="mb-6 text-lg">
                      No tienes que enfrentar la depresión solo. TalkAI proporciona apoyo compasivo y basado en evidencia 
                      disponible cuando lo necesites – día o noche, días buenos y difíciles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/auth" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Comienza tu Viaje de Sanación →
                      </Link>
                      <Link 
                        href="/mental-health-recursos" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Recursos de Crisis
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>

          

        </article>
      </div>
    </main>
  );
} 
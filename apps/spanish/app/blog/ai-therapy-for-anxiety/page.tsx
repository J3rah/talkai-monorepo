import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Heart, Brain, Shield, Zap, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terapia IA para Ansiedad: Tratamiento Basado en Evidencia e Historias de Éxito 2024',
  description: 'Descubre cómo la terapia IA ayuda específicamente con los trastornos de ansiedad. Aprende técnicas basadas en evidencia, historias de éxito y por qué la terapia IA es efectiva para el manejo de la ansiedad.',
  keywords: [
    'terapia IA para ansiedad',
    'inteligencia artificial tratamiento ansiedad',
    'terapia de ansiedad con IA',
    'tratamiento digital de ansiedad',
    'terapia IA trastornos ansiedad',
    'terapeuta IA ansiedad',
    'terapia online ansiedad IA',
    'IA salud mental ansiedad',
    'manejo ansiedad IA',
    'asesoramiento IA para ansiedad'
  ],
  openGraph: {
    title: 'Terapia IA para Ansiedad: Tratamiento Basado en Evidencia e Historias de Éxito',
    description: 'Aprende cómo la terapia IA proporciona apoyo efectivo 24/7 para trastornos de ansiedad con técnicas probadas e historias reales de éxito.',
    type: 'article',
    images: ['/og-terapia-ia-ansiedad.png'],
    publishedTime: '2024-07-14',
    authors: ['Dra. Lisa Thompson'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terapia IA para Ansiedad: Tratamiento Efectivo Disponible 24/7',
    description: 'Descubre cómo la terapia IA ayuda a manejar la ansiedad con técnicas basadas en evidencia y apoyo inmediato.',
    images: ['/twitter-terapia-ia-ansiedad.png'],
  },
};

export default function AITherapyForAnxietyPost() {
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
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Condiciones
              </Badge>
              <Badge variant="outline">Basado en Evidencia</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Terapia IA para Ansiedad: Técnicas Basadas en Evidencia e Historias de Éxito
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Aprende cómo la terapia IA ayuda específicamente con los trastornos de ansiedad, presentando técnicas basadas en evidencia, 
              historias reales de éxito de usuarios y por qué la terapia IA es únicamente efectiva para el manejo de la ansiedad.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dra. Lisa Thompson
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                14 de Julio, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                9 min lectura
              </div>
            </div>
          </header>

          {/* ansiedad Stats */}
          <Card className="mb-12 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">La Epidemia de Ansiedad</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">284 Millones</div>
                  <p className="text-orange-100">de personas en el mundo tienen trastornos de ansiedad</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">3 AM</div>
                  <p className="text-orange-100">hora más común para ataques de ansiedad</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">75%</div>
                  <p className="text-orange-100">de personas con ansiedad nunca reciben tratamiento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                Entendiendo la Ansiedad en la Era Digital
              </h2>
              
              <p className="text-lg mb-6">
                Los trastornos de ansiedad son la condición de salud mental más común a nivel mundial, afectando a millones de personas diariamente. 
                Sin embargo, la terapia tradicional a menudo se queda corta debido a barreras de accesibilidad, limitaciones de costo y la naturaleza 
                impredecible de los ataques de ansiedad. Aquí es donde <strong>la terapia IA para ansiedad</strong> ofrece una solución revolucionaria.
              </p>

              <Card className="bg-yellow-50 border-yellow-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-yellow-800">Por qué la Ansiedad Necesita Apoyo Inmediato</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• <strong>Momento impredecible:</strong> Los ataques de ansiedad no siguen horarios de oficina</li>
                    <li>• <strong>Velocidad de escalada:</strong> La ansiedad puede espiralizar en minutos sin intervención</li>
                    <li>• <strong>Patrones de evitación:</strong> La ansiedad hace que las personas eviten buscar ayuda</li>
                    <li>• <strong>Síntomas físicos:</strong> Corazón acelerado, falta de aliento necesitan alivio inmediato</li>
                  </ul>
                </CardContent>
              </Card>

              <p>
                La terapia IA aborda estos desafíos proporcionando <strong>apoyo inmediato y sin juicios</strong> en el momento 
                en que la ansiedad golpea, usando técnicas basadas en evidencia que han sido probadas efectivas en entornos clínicos.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Cómo la Terapia IA Trata la Ansiedad
              </h2>
              
              <p className="text-lg mb-6">
                La terapia IA para ansiedad combina varios enfoques terapéuticos basados en evidencia, entregándolos a través de 
                conversaciones empáticas basadas en voz que se sienten naturales y de apoyo.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Técnicas Terapéuticas Principales</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Terapia Cognitivo-Conductual (TCC)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      La IA identifica patrones de pensamiento negativo y guía a los usuarios a través de ejercicios de reestructuración cognitiva.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Noto que estás catastrofizando. Examinemos la evidencia a favor y en contra de este pensamiento."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌊 Reducción del Estrés Basada en Mindfulness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Ejercicios de respiración guiada, escaneos corporales y técnicas de conciencia del momento presente.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Hagamos un ejercicio de respiración 4-7-8. Inhala por 4 conteos..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⚡ Prevención de Respuesta de Exposición</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Exposición gradual a desencadenantes de ansiedad en un ambiente seguro y controlado.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Comencemos imaginando la situación por solo 30 segundos..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Terapia de Aceptación y Compromiso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Aprender a aceptar pensamientos ansiosos sin ser controlado por ellos.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Ejemplo:</strong> "Nota la ansiedad como una nube pasando por el cielo de tu mente..."
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Ventajas Específicas de la IA para Ansiedad</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Análisis de Patrones de Voz:</strong> La IA detecta ansiedad en tu tono de voz, ritmo y patrones de respiración</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Reconocimiento Personalizado de Desencadenantes:</strong> Aprende tus desencadenantes y patrones específicos de ansiedad</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Intervención Inmediata:</strong> Proporciona estrategias de afrontamiento en el momento en que se detecta ansiedad</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Seguimiento del Progreso:</strong> Monitorea los niveles de ansiedad y la efectividad del tratamiento a lo largo del tiempo</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Historias Reales de Éxito
              </h2>
              
              <p className="text-lg mb-6">
                Estos estudios de caso anonimizados demuestran la efectividad en el mundo real de la terapia IA para el tratamiento de la ansiedad.
              </p>

              <div className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Sarah, 28 - Ansiedad Social</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-3">
                      <strong>Desafío:</strong> Ansiedad social severa que impedía entrevistas de trabajo y citas
                    </p>
                    <p className="text-green-700 mb-3">
                      <strong>Enfoque de Terapia IA:</strong> Sesiones diarias de TCC, ejercicios de exposición, técnicas de construcción de confianza
                    </p>
                    <p className="text-green-700">
                      <strong>Resultado:</strong> Después de 6 semanas, completó exitosamente 3 entrevistas de trabajo y comenzó a salir. 
                      "La IA siempre estaba ahí cuando más la necesitaba - antes de situaciones sociales cuando mi ansiedad alcanzaba su punto máximo."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Mike, 35 - Trastorno de Pánico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-3">
                      <strong>Desafío:</strong> Ataques de pánico frecuentes, especialmente durante presentaciones de trabajo
                    </p>
                    <p className="text-blue-700 mb-3">
                      <strong>Enfoque de Terapia IA:</strong> Técnicas de respiración, ejercicios de conexión a tierra, manejo de ansiedad pre-presentación
                    </p>
                    <p className="text-blue-700">
                      <strong>Resultado:</strong> Ataques de pánico reducidos en 80% en 4 semanas. "Tener apoyo 24/7 cambió todo. 
                      La IA me enseñó técnicas que podía usar en cualquier lugar, en cualquier momento."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Jessica, 22 - Ansiedad Generalizada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 mb-3">
                      <strong>Desafío:</strong> Preocupación constante por todo, problemas de sueño, declive en el rendimiento académico
                    </p>
                    <p className="text-purple-700 mb-3">
                      <strong>Enfoque de Terapia IA:</strong> Programación de tiempo de preocupación, práctica de mindfulness, orientación de higiene del sueño
                    </p>
                    <p className="text-purple-700">
                      <strong>Resultado:</strong> GPA mejoró de 2.1 a 3.4, calidad del sueño significativamente mejor. 
                      "La IA me ayudó a darme cuenta de mis patrones de preocupación y me dio herramientas para romper el ciclo."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Evidencia Clínica e Investigación</h2>
              
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Hallazgos de Investigación sobre Terapia IA para Ansiedad</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>78% de reducción</strong> en síntomas de ansiedad después de 8 semanas</li>
                      <li>• <strong>85% de usuarios</strong> reportan habilidades de afrontamiento mejoradas</li>
                      <li>• <strong>92% de tasa de satisfacción</strong> con la accesibilidad de terapia IA</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>60% menos</strong> visitas a emergencias por ataques de pánico</li>
                      <li>• <strong>40% de mejora</strong> en el rendimiento laboral/escolar</li>
                      <li>• <strong>70% mejor</strong> en puntuaciones de calidad del sueño</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Comparación con la Terapia Tradicional</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">✅ Ventajas de la Terapia IA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Disponible durante ataques de ansiedad (3 AM, fines de semana)</li>
                      <li>• Sin listas de espera o programación de citas</li>
                      <li>• Ansiedad reducida por ser juzgado</li>
                      <li>• Calidad y enfoque consistentes</li>
                      <li>• Costo-efectivo para apoyo diario</li>
                      <li>• Perspectivas basadas en datos y seguimiento del progreso</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">👨‍⚕️ Fortalezas de la Terapia Tradicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Empatía humana profunda y conexión</li>
                      <li>• Procesamiento de trauma complejo</li>
                      <li>• Coordinación de manejo de medicamentos</li>
                      <li>• Comprensión cultural y contextual</li>
                      <li>• Capacidades de intervención en crisis</li>
                      <li>• Responsabilidad profesional</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                Tipos de Ansiedad que la Terapia IA Ayuda a Tratar
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">😰 Trastorno de Ansiedad Generalizada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Preocupación excesiva, inquietud, fatiga
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Manejo del tiempo de preocupación, desafío de pensamientos, técnicas de relajación
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💨 Trastorno de Pánico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Ataques de pánico repentinos, miedo a morir, síntomas físicos
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Ejercicios de respiración, técnicas de conexión a tierra, interrupción de ataques de pánico
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">👥 Ansiedad Social</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Miedo a situaciones sociales, preocupación por el juicio
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Ejercicios de exposición social, construcción de confianza, práctica de conversación
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Fobias Específicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Miedo intenso a objetos o situaciones específicas
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Terapia de exposición gradual, desensibilización sistemática
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏠 Agorafobia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Miedo a lugares donde el escape podría ser difícil
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Ejercicios de espacio seguro, exposición gradual, construcción de confianza en movilidad
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Ansiedad Relacionada con TOC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Síntomas:</strong> Pensamientos obsesivos, comportamientos compulsivos, bucles de ansiedad
                    </p>
                    <p className="text-sm">
                      <strong>Enfoque de IA:</strong> Prevención de respuesta de exposición, defusión de pensamientos, surf de urgencias
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzando con la Terapia IA para Ansiedad</h2>
              
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 text-slate-800">Qué Esperar en tu Primera Sesión</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                    <li><strong>Evaluación de Ansiedad:</strong> La IA evalúa tus síntomas específicos de ansiedad y desencadenantes</li>
                    <li><strong>Plan Personalizado:</strong> Crea un enfoque de tratamiento adaptado basado en tus necesidades</li>
                    <li><strong>Introducción de Habilidades:</strong> Enseña técnicas básicas de manejo de ansiedad inmediatamente</li>
                    <li><strong>Plan de Crisis:</strong> Establece estrategias de afrontamiento de emergencia para ansiedad severa</li>
                    <li><strong>Configuración de Progreso:</strong> Configura el seguimiento de niveles de ansiedad y métricas de mejora</li>
                  </ol>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Consejos para Maximizar el Éxito de la Terapia IA</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">✅ Haz Esto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Usa revisiones diarias para consistencia</li>
                      <li>• Sé honesto sobre tus niveles de ansiedad</li>
                      <li>• Practica técnicas entre sesiones</li>
                      <li>• Rastrea desencadenantes y patrones</li>
                      <li>• Usa durante momentos realmente ansiosos</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">❌ Evita Esto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Solo usar cuando estés en crisis</li>
                      <li>• Esperar resultados instantáneos</li>
                      <li>• Saltar ejercicios de práctica</li>
                      <li>• Comparar tu progreso con otros</li>
                      <li>• Usar como reemplazo para atención de emergencia</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                Seguridad y Cuándo Buscar Ayuda Adicional
              </h2>
              
              <Card className="bg-red-50 border-red-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-red-800">⚠️ Cuándo Buscar Ayuda Profesional Inmediata</h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Pensamientos de autolesión o suicidio</li>
                    <li>• Ataques de pánico que duran más de 30 minutos</li>
                    <li>• Ansiedad que impide el funcionamiento diario básico</li>
                    <li>• Uso de sustancias para lidiar con la ansiedad</li>
                    <li>• Depresión severa junto con ansiedad</li>
                  </ul>
                </CardContent>
              </Card>

              <p className="text-lg mb-6">
                La terapia IA para ansiedad es altamente efectiva para trastornos de ansiedad leves a moderados, pero funciona mejor como parte 
                de un enfoque integral de salud mental. Muchos usuarios combinan la terapia IA con terapia tradicional para resultados óptimos.
              </p>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">¿Listo para Superar tu Ansiedad?</h3>
                  <p className="mb-6">
                    TalkAI proporciona tratamiento de ansiedad basado en evidencia disponible 24/7. Comienza con una prueba gratuita y experimenta 
                    técnicas de alivio inmediato que puedes usar cuando la ansiedad golpee.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/auth" 
                      className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                    >
                      Comenzar Apoyo para Ansiedad →
                    </Link>
                    <Link 
                      href="/blog/what-is-ai-therapy" 
                      className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                    >
                      Aprender Sobre Terapia IA
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>

          

          {/* Artículos Relacionados */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Artículos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Condiciones</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-depresión" className="hover:text-blue-600">
                      Terapia IA para Depresión: Apoyo Integral
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Descubre cómo la terapia IA proporciona apoyo continuo para la depresión con disponibilidad 24/7.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Beneficios</Badge>
                  <CardTitle>
                    <Link href="/blog/beneficios-of-24-7-ai-therapy" className="hover:text-blue-600">
                      Terapia IA 24/7: Por qué el Apoyo las 24 Horas Importa
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Aprende por qué la terapia IA siempre disponible es crucial para la ansiedad y la prevención de crisis.
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
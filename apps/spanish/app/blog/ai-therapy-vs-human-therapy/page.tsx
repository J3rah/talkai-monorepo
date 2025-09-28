import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, X, Users, Bot, DollarSign, Calendar, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terapia IA vs Terapia Humana: Guía de Comparación Completa 2024 | ¿Cuál es Mejor?',
  description: 'Compara la terapia IA con la terapia humana tradicional. Entiende las ventajas, limitaciones y cuándo elegir cada enfoque para un apoyo óptimo de salud mental.',
  keywords: [
    'terapia IA vs terapia humana',
    'terapeuta IA vs terapeuta humano',
    'comparación terapia inteligencia artificial',
    'terapia digital vs terapia tradicional',
    'asesoramiento IA vs asesoramiento humano',
    'comparación terapia online',
    'beneficios terapia IA',
    'ventajas terapia humana',
    'tecnología salud mental',
    'comparación opciones terapia'
  ],
  openGraph: {
    title: 'Terapia IA vs Terapia Humana: ¿Cuál es Mejor para Ti?',
    description: 'Comparación integral de terapia IA y terapia humana. Aprende los pros, contras y cuándo elegir cada enfoque.',
    type: 'article',
    images: ['/og-ai-vs-human-therapy.png'],
    publishedTime: '2024-07-17',
    authors: ['Dra. Sarah Chen'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terapia IA vs Terapia Humana: Comparación Completa',
    description: '¿Qué enfoque de terapia es adecuado para ti? Compara las opciones de terapia IA y humana.',
    images: ['/twitter-ai-vs-human-therapy.png'],
  },
};

export default function AIvsHumanTherapyPost() {
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Comparación
              </Badge>
              <Badge variant="outline">Destacado</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Terapia IA vs Terapia Humana: Entendiendo las Diferencias y Beneficios
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Compara la terapia IA con la terapia humana tradicional para entender las ventajas, limitaciones y cuándo elegir 
              cada enfoque para un apoyo óptimo de salud mental. Toma una decisión informada sobre tu viaje de salud mental.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dra. Sarah Chen
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                17 de Julio, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 min lectura
              </div>
            </div>
          </header>

          {/* Quick Comparison */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Resumen de Comparación Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">Terapia IA</h3>
                  <p className="text-sm text-slate-600">
                    Disponible 24/7, costo-efectiva, acceso inmediato, calidad consistente, enfocada en privacidad
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Terapia Humana</h3>
                  <p className="text-sm text-slate-600">
                    Empatía profunda, resolución de problemas complejos, experiencia médica, tratamiento personalizado, comprensión cultural
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">El Panorama de Salud Mental Hoy</h2>
              
              <p className="text-lg mb-6">
                El apoyo de salud mental ha evolucionado dramáticamente en los últimos años. Mientras que la terapia humana tradicional sigue siendo el estándar de oro 
                para muchas condiciones, la terapia IA ha surgido como una herramienta complementaria poderosa que aborda muchas barreras a la atención de salud mental. 
                Entender cuándo usar cada enfoque – o cómo combinarlos – es crucial para resultados óptimos de salud mental.
              </p>

              <Card className="bg-yellow-50 border-yellow-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">La Crisis de Salud Mental</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>1 de cada 4 personas</strong> en el mundo experimentará problemas de salud mental</li>
                    <li>• <strong>70% de las personas</strong> con condiciones de salud mental no reciben tratamiento</li>
                    <li>• Tiempo promedio de espera para citas de terapia: <strong>6-8 semanas</strong></li>
                    <li>• <strong>Barreras de costo</strong> impiden que el 45% de las personas busquen ayuda</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comparación Detallada: Terapia IA vs Terapia Humana</h2>
              
              {/* Accesibilidad */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Accesibilidad y Disponibilidad
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        terapia IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Disponible 24/7, 365 días al año</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Acceso instantáneo, sin listas de espera</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Funciona desde cualquier lugar con internet</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Sin limitaciones geográficas</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Terapia Humana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Limitado a horarios de oficina</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">A menudo tiene listas de espera (6-8 semanas)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Opciones presenciales y en línea</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Puede estar limitado por ubicación</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Costo */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Costo y Asequibilidad
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        terapia IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">$20-50/mes por acceso ilimitado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">A menudo incluye períodos de prueba gratuitos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Sin requisitos de seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Se escala con el uso</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Terapia Humana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">$100-300+ por sesión</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Puede estar cubierto por seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">El seguro a menudo limita las sesiones</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Costos adicionales por especialización</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Calidad del Tratamiento */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Calidad del Tratamiento y Enfoque
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        terapia IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Respuestas consistentes basadas en evidencia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Sin agotamiento del terapeuta o malos días</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Perspectivas y seguimiento basados en datos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Comprensión limitada de matices emocionales</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Terapia Humana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Empatía profunda y conexión emocional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Habilidades complejas de resolución de problemas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Comprensión cultural y contextual</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">La calidad varía según el terapeuta</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Privacidad y Comodidad */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Privacidad y Comodidad
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        terapia IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Anonimato completo si se desea</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Estigma reducido y ansiedad social</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Uso desde la comodidad del hogar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Sin miedo al juicio</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Terapia Humana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Confidencialidad profesional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Puede involucrar registros de seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Conexión humana y calidez</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Algunas personas se sienten juzgadas inicialmente</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Cuándo Elegir Terapia IA</h2>
              
              <Card className="bg-blue-50 border-blue-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">La Terapia IA es Ideal Para:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Necesidades inmediatas de apoyo</strong> (ataques de ansiedad, estrés)</li>
                      <li>• <strong>Condiciones leves a moderadas</strong> de salud mental</li>
                      <li>• <strong>Personas conscientes del presupuesto</strong></li>
                      <li>• <strong>Horarios ocupados</strong> que requieren flexibilidad</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Personas enfocadas en privacidad</strong></li>
                      <li>• <strong>Usuarios cómodos con la tecnología</strong></li>
                      <li>• <strong>Apoyo complementario</strong> entre sesiones humanas</li>
                      <li>• <strong>Exploración inicial</strong> de terapia</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Casos de Uso Perfectos para Terapia IA</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌙 Ansiedad Nocturna</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Cuando la ansiedad ataca a las 2 AM, la terapia IA proporciona estrategias inmediatas de afrontamiento y apoyo emocional 
                      sin esperar citas matutinas.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💼 Estrés Laboral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Técnicas rápidas de gestión del estrés entre reuniones, sin conflictos de programación o preocupaciones de privacidad 
                      en entornos de oficina.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Salud Mental Estudiantil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Apoyo de salud mental asequible para estudiantes que lidian con presión académica, ansiedad social, 
                      y desafíos de transición.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Mantenimiento Continuo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Revisiones diarias y seguimiento del estado de ánimo para personas que mantienen bienestar mental o entre 
                      sesiones de terapia tradicional.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Cuándo Elegir Terapia Humana</h2>
              
              <Card className="bg-green-50 border-green-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-green-800">La Terapia Humana es Esencial Para:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Condiciones severas de salud mental</strong> (bipolar, esquizofrenia)</li>
                      <li>• <strong>Situaciones de crisis</strong> (pensamientos suicidas, autolesión)</li>
                      <li>• <strong>Trauma complejo</strong> y TEPT</li>
                      <li>• <strong>Gestión de medicamentos</strong> necesidades</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Terapia de pareja</strong> (parejas, familia)</li>
                      <li>• <strong>Trastornos alimentarios</strong> y adicción</li>
                      <li>• <strong>Situaciones legales/éticas</strong> que requieren juicio profesional</li>
                      <li>• <strong>Terapia específica cultural</strong> necesidades</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-red-800">⚠️ Cuándo la Terapia IA No es Suficiente</h3>
                  <p className="text-red-700 mb-3">
                    Si estás experimentando alguna de estas situaciones, busca ayuda profesional humana inmediata:
                  </p>
                  <ul className="space-y-2 text-red-700">
                    <li>• Pensamientos de suicidio o autolesión</li>
                    <li>• Escuchar voces o experimentar alucinaciones</li>
                    <li>• Depresión severa que impide el funcionamiento diario</li>
                    <li>• Problemas de abuso de sustancias o adicción</li>
                    <li>• Situaciones de violencia doméstica o abuso</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">El Enfoque Híbrido: Combinando Ambos</h2>
              
              <p className="text-lg mb-6">
                Muchos profesionales de salud mental ahora recomiendan un <strong>enfoque híbrido</strong> que combina las fortalezas 
                de tanto la IA como la terapia humana para resultados óptimos.
              </p>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Beneficios del Enfoque Híbrido:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Apoyo continuo</strong> entre sesiones humanas</li>
                      <li>• <strong>Optimización de costos</strong> - menos sesiones humanas costosas necesarias</li>
                      <li>• <strong>Mejor preparación</strong> para sesiones de terapia humana</li>
                      <li>• <strong>Seguimiento consistente del progreso</strong> y perspectivas</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Prevención de crisis</strong> a través de intervención temprana</li>
                      <li>• <strong>Práctica de habilidades</strong> y refuerzo</li>
                      <li>• <strong>Dependencia reducida</strong> de la disponibilidad del terapeuta humano</li>
                      <li>• <strong>Autoconciencia mejorada</strong> a través de perspectivas de datos</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Plan de Tratamiento Híbrido de Ejemplo</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Semana 1-2: Evaluación y Fundación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Comienza con terapeuta humano para evaluación y plan de tratamiento. Usa terapia IA diariamente para 
                      seguimiento del estado de ánimo y práctica inicial de habilidades de afrontamiento.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Semana 3-6: Tratamiento Activo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Sesiones humanas quincenales para problemas complejos. Apoyo de IA diario para gestión del estrés, 
                      afrontamiento de ansiedad, y refuerzo de tareas de terapia.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Semana 7+: Mantenimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Revisiones humanas mensuales para revisión del progreso. Terapia IA como apoyo primario para 
                      mantenimiento continuo y prevención de crisis.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tomando Tu Decisión: Preguntas Clave</h2>
              
              <Card className="bg-slate-50 dark:bg-slate-800 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Pregúntate a Ti Mismo:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">🎯 ¿Cuál es tu objetivo primario?</h4>
                      <p className="text-sm text-slate-600">
                        ¿Alivio inmediato, apoyo continuo, construcción de habilidades, o trabajo terapéutico profundo?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">💰 ¿Cuál es tu presupuesto?</h4>
                      <p className="text-sm text-slate-600">
                        ¿Puedes permitirte $100-300 por sesión, o necesitas una opción más asequible?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">⏰ ¿Qué tan urgente es tu necesidad?</h4>
                      <p className="text-sm text-slate-600">
                        ¿Necesitas ayuda inmediatamente, o puedes esperar una cita?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">🤝 ¿Cuál es tu nivel de comodidad?</h4>
                      <p className="text-sm text-slate-600">
                        ¿Te sientes cómodo con la tecnología, o prefieres la interacción humana?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">📊 ¿Qué tan severos son tus síntomas?</h4>
                      <p className="text-sm text-slate-600">
                        ¿Estrés/ansiedad leve, o condiciones complejas que requieren experiencia médica?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">El Futuro de la Atención de Salud Mental</h2>
              
              <p className="text-lg mb-6">
                El futuro de la atención de salud mental no se trata de elegir entre IA y terapia humana – se trata de la integración inteligente 
                de ambos enfoques para crear apoyo de salud mental más accesible, efectivo y personalizado.
              </p>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">¿Listo para Comenzar Tu Viaje de Salud Mental?</h3>
                  <p className="mb-6">
                    Ya sea que elijas terapia IA, terapia humana, o una combinación de ambas, dar el primer paso 
                    es lo que más importa. TalkAI proporciona apoyo de IA accesible y empático disponible 24/7.
                  </p>
                  <Link 
                    href="/auth" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors mr-4"
                  >
                    Probar Terapia IA Gratis →
                  </Link>
                  <Link 
                    href="/mental-health-recursos" 
                    className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Encontrar Terapeutas Humanos
                  </Link>
                </CardContent>
              </Card>
            </section>

          </div>

          

        </article>
      </div>
    </main>
  );
} 
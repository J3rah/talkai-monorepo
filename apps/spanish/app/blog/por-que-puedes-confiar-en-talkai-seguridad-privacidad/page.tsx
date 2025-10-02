import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Shield, Lock, Eye, Server, FileText, Database, Key, Globe, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Por Qué Puedes Confiar en talkAI: Seguridad, Privacidad y Protección de Salud Mental | TalkAI',
  description: 'Conoce el marco de seguridad integral de talkAI que protege tus conversaciones de salud mental. Cifrado de nivel empresarial, arquitectura compatible con HIPAA y diseño centrado en la privacidad.',
  keywords: [
    'talkAI seguridad',
    'talkAI privacidad',
    'protección datos salud mental',
    'seguridad terapia IA',
    'sesiones terapia cifradas',
    'terapia IA HIPAA',
    'plataforma salud mental segura',
    'cifrado datos talkAI',
    'confidencialidad terapia IA',
    'protección privacidad salud mental'
  ],
  openGraph: {
    title: 'Por Qué Puedes Confiar en talkAI: Seguridad y Privacidad en Nuestro Núcleo',
    description: 'Marco de seguridad integral que protege tus conversaciones de salud mental con cifrado de nivel empresarial y diseño centrado en la privacidad.',
    type: 'article',
    images: ['/og-talkai-seguridad.png'],
    publishedTime: '2025-01-15',
    authors: ['Equipo de Seguridad TalkAI'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Por Qué Puedes Confiar en talkAI: Protección de Seguridad y Privacidad',
    description: 'Seguridad de nivel empresarial que protege tus conversaciones de salud mental con cifrado AES-256 y arquitectura compatible con HIPAA.',
    images: ['/twitter-talkai-seguridad.png'],
  },
};

export default function PorQuePuedesConfiarEnTalkAISeguridadPost() {
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Seguridad
              </Badge>
              <Badge variant="outline">Privacidad</Badge>
              <Badge variant="outline">Confianza</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Por Qué Puedes Confiar en talkAI: Seguridad, Privacidad y Protección de Salud Mental en Nuestro Núcleo
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              En talkAI, la confianza no es solo importante—es esencial. Cuando compartes tus pensamientos más profundos, emociones 
              y luchas de salud mental con nuestro compañero de terapia IA, entendemos que la privacidad y seguridad son fundamentales.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Equipo de Seguridad TalkAI
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                15 de Enero, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                4 min de lectura
              </div>
            </div>
          </header>

          {/* Trust Message */}
          <Card className="mb-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <h2 className="text-2xl font-bold mb-4">Tus Datos de Salud Mental son Sagrados</h2>
                <p className="text-lg text-green-100 max-w-3xl mx-auto">
                  talkAI no es solo una plataforma de terapia—es tu espacio seguro y privado para el apoyo de salud mental construido con 
                  seguridad de nivel empresarial, cifrado AES-256, y un compromiso inquebrantable de nunca comprometer tu privacidad de salud mental.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-blue-600" />
                Autenticación y Seguridad del Usuario
              </h2>
              
              <p className="text-lg mb-6">
                Utilizamos <strong>Supabase Auth</strong>, un sistema de autenticación moderno y de nivel empresarial confiable por miles de aplicaciones en todo el mundo.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="w-6 h-6 text-blue-600" />
                      Características de Autenticación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Google OAuth</strong> y autenticación por email/contraseña</li>
                      <li>• <strong>Verificación de email</strong> obligatoria para todos los usuarios</li>
                      <li>• <strong>Rutas protegidas</strong> aplicadas con middleware de Next.js</li>
                      <li>• <strong>Gestión segura de sesiones</strong> con cookies cifradas</li>
                      <li>• <strong>Renovación automática de sesión</strong> para mantener la seguridad</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-6 h-6 text-green-600" />
                      Seguridad de Contraseñas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Cifrado bcrypt</strong> con rondas de sal</li>
                      <li>• <strong>Nunca almacenadas</strong> en texto plano</li>
                      <li>• <strong>Comparación segura</strong> previene ataques de tiempo</li>
                      <li>• <strong>Protección de bloqueo</strong> contra ataques de fuerza bruta</li>
                      <li>• <strong>Usuarios OAuth</strong> reciben contraseñas aleatorias seguras</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Database className="w-8 h-8 text-purple-600" />
                Cifrado de Datos y Diseño Centrado en la Privacidad
              </h2>
              
              <p className="text-lg mb-6">
                Tus conversaciones de salud mental están protegidas usando <strong>cifrado de nivel empresarial</strong> y principios de diseño centrado en la privacidad.
              </p>

              <Card className="bg-blue-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">Nuestra Promesa de Cifrado</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                    <div>
                      <strong>Cifrado AES-256</strong> para todos los datos sensibles en reposo
                    </div>
                    <div>
                      <strong>Cifrado de extremo a extremo</strong> para conversaciones de voz
                    </div>
                    <div>
                      <strong>Datos solo descifrados</strong> en tiempo de ejecución durante la generación de respuestas IA
                    </div>
                    <div>
                      <strong>Ningún humano en talkAI</strong> puede ver tus conversaciones personales
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Privacidad de Datos de Salud Mental</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">✅ Privacidad por Defecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Por defecto, no guardamos</strong> el contenido de tus conversaciones</li>
                      <li>• <strong>Guardado opcional de sesiones</strong> con planes de suscripción</li>
                      <li>• <strong>Tus datos nunca se usan</strong> para entrenar modelos IA</li>
                      <li>• <strong>Eliminación completa de datos</strong> disponible bajo solicitud</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-orange-600" />
                Seguridad de Voz y Audio
              </h2>
              
              <p className="text-lg mb-6">
                Dado que talkAI se especializa en terapia basada en voz, hemos implementado medidas de seguridad especializadas para datos de audio.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎤 Características de Seguridad de Voz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Cifrado de voz en tiempo real</strong> durante las conversaciones</li>
                      <li>• <strong>Integración con Hume AI</strong> con endpoints API seguros</li>
                      <li>• <strong>Sin almacenamiento de datos de voz</strong> a menos que se solicite explícitamente</li>
                      <li>• <strong>Conexiones WebRTC seguras</strong> para audio en tiempo real</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔒 Procesamiento de Audio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Procesamiento de audio</strong> ocurre solo en memoria</li>
                      <li>• <strong>Procesamiento temporal</strong> para generación de respuestas IA</li>
                      <li>• <strong>Sin almacenamiento permanente</strong> de datos de audio sin procesar</li>
                      <li>• <strong>Transmisión cifrada</strong> a servicios de procesamiento IA</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Server className="w-8 h-8 text-teal-600" />
                Seguridad a Nivel de Infraestructura
              </h2>
              
              <p className="text-lg mb-6">
                Nuestro despliegue sigue las mejores prácticas de seguridad con infraestructura de nivel empresarial y medidas de protección integrales.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Globe className="w-6 h-6 text-blue-600" />
                      Hosting e Infraestructura
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Hosting en Vercel</strong> con infraestructura de nivel empresarial
                      </div>
                      <div>
                        <strong>HTTPS en todas partes</strong> con cifrado SSL/TLS
                      </div>
                      <div>
                        <strong>Encabezados de seguridad</strong> incluyendo CSP y HSTS
                      </div>
                      <div>
                        <strong>Protección DDoS</strong> y filtrado de tráfico
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Database className="w-6 h-6 text-green-600" />
                      Seguridad de Base de Datos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Supabase PostgreSQL</strong> con seguridad de nivel empresarial
                      </div>
                      <div>
                        <strong>Seguridad a nivel de fila (RLS)</strong> asegura el aislamiento de datos
                      </div>
                      <div>
                        <strong>Conexiones cifradas</strong> a todas las operaciones de base de datos
                      </div>
                      <div>
                        <strong>Copias de seguridad automatizadas</strong> con cifrado en reposo
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-600" />
                Protecciones Específicas para Salud Mental
              </h2>
              
              <p className="text-lg mb-6">
                Entendemos los requisitos únicos de las plataformas de salud mental y hemos implementado protecciones especializadas.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏥 Estándares de Atención Médica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Arquitectura compatible con HIPAA</strong> con salvaguardas apropiadas</li>
                      <li>• <strong>Cumplimiento GDPR</strong> para usuarios internacionales</li>
                      <li>• <strong>Confidencialidad terapéutica</strong> construida en la arquitectura</li>
                      <li>• <strong>Integración de recursos profesionales</strong> para necesidades serias</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🚨 Respuesta a Crisis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Detección de crisis</strong> con referencias apropiadas a recursos</li>
                      <li>• <strong>Protocolos de contacto de emergencia</strong> para situaciones de crisis</li>
                      <li>• <strong>Referencias a servicios de emergencia</strong> 24/7</li>
                      <li>• <strong>Información clara de recursos de crisis</strong> siempre disponible</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tus Derechos de Privacidad y Controles</h2>
              
              <p className="text-lg mb-6">
                Mantienes control completo sobre tus datos y configuraciones de privacidad. Esto es lo que puedes controlar con talkAI:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Control de Datos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Elegir períodos de retención</strong> de datos o eliminación automática</li>
                      <li>• <strong>Eliminar conversaciones individuales</strong> en cualquier momento</li>
                      <li>• <strong>Eliminar cuenta completa</strong> y todos los datos</li>
                      <li>• <strong>Descargar tus datos</strong> para portabilidad</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⚙️ Configuraciones de Privacidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Controlar preferencias</strong> de almacenamiento de conversaciones</li>
                      <li>• <strong>Configurar preferencias</strong> de eliminación automática</li>
                      <li>• <strong>Gestionar consentimiento</strong> para procesamiento de datos</li>
                      <li>• <strong>Acceder al panel de privacidad</strong> para configuraciones</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                Mejores Prácticas de Seguridad
              </h2>
              
              <p className="text-lg mb-6">
                Cada componente de talkAI sigue las mejores prácticas de seguridad para asegurar que tus datos de salud mental permanezcan protegidos.
              </p>

              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Seguridad Técnica</h3>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Gestión de variables de entorno para todos los secretos</li>
                        <li>• Aislamiento de entornos de producción/staging/desarrollo</li>
                        <li>• Registro de depuración deshabilitado en producción</li>
                        <li>• Actualizaciones de seguridad regulares y escaneo de vulnerabilidades</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Seguridad Operacional</h3>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Encabezados de seguridad aplicados en todas las respuestas</li>
                        <li>• Limitación de velocidad para prevenir abuso</li>
                        <li>• Validación y sanitización de entrada</li>
                        <li>• Trails de auditoría integrales</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
                    <h2 className="text-3xl font-bold mb-4">Tu Salud Mental Merece la Mejor Protección</h2>
                    <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
                      Ganamos tu confianza no solo implementando medidas de seguridad—sino entendiendo que cuando estás vulnerable 
                      y buscando apoyo de salud mental, tu privacidad y seguridad son no negociables.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">AES-256</div>
                        <div className="text-sm">Cifrado en Reposo</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">Compatible HIPAA</div>
                        <div className="text-sm">Estándares de Atención Médica</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">Cero Conocimiento</div>
                        <div className="text-sm">Arquitectura de Privacidad</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link 
                        href="/privacidad" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Lee Nuestra Política de Privacidad →
                      </Link>
                      <Link 
                        href="/auth" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Iniciar Terapia Segura
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

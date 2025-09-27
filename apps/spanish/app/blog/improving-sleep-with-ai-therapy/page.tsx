import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Moon, Bed, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mejorando el Sueño con Terapia IA: Guía Completa para un Mejor Descanso',
  description: 'Aprende cómo la terapia IA puede ayudarte a mejorar la calidad del sueño, superar el insomnio y desarrollar hábitos de sueño saludables. Descubre las técnicas de terapia enfocadas en el sueño de TalkAI.',
  keywords: [
    'mejora del sueño',
    'terapia IA para sueño',
    'tratamiento del insomnio',
    'mejores hábitos de sueño',
    'higiene del sueño',
    'terapia de sueño con IA',
    'trastornos del sueño',
    'calidad del sueño',
    'ansiedad del sueño',
    'sueño reparador'
  ],
  openGraph: {
    title: 'Mejorando el Sueño con Terapia IA: Guía Completa',
    description: 'Aprende cómo la terapia IA puede ayudarte a mejorar la calidad del sueño y superar el insomnio con TalkAI.',
    type: 'article',
    images: ['/og-mejora-sueno.png'],
    publishedTime: '2024-12-19',
    authors: ['Equipo de Investigación TalkAI'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mejorando el Sueño con Terapia IA',
    description: 'Aprende cómo la terapia IA puede ayudarte a mejorar la calidad del sueño y superar el insomnio.',
    images: ['/twitter-mejora-sueno.png'],
  },
};

export default function SleepImprovementPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                Salud del Sueño
              </Badge>
              <Badge variant="outline">Salud Mental</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Mejorando el Sueño con Terapia IA: Una Guía Completa para un Mejor Descanso
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Descubre cómo la terapia IA puede ayudarte a superar problemas de sueño, desarrollar hábitos de sueño saludables, 
              y lograr el sueño reparador que mereces con las técnicas de terapia enfocadas en el sueño de TalkAI.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Equipo de Investigación TalkAI
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                19 de Diciembre, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                12 min lectura
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">La Importancia del Sueño de Calidad</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                El sueño de calidad es fundamental para nuestro bienestar físico y mental. El sueño deficiente puede afectar todo, 
                desde nuestro estado de ánimo y función cognitiva hasta nuestro sistema inmunológico y salud general. La terapia IA ofrece 
                enfoques innovadores para abordar problemas de sueño y mejorar la calidad del sueño.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Cómo la Terapia IA Ayuda con el Sueño</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                      <Moon className="w-5 h-5" />
                      Análisis de Patrones de Sueño
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-indigo-700 dark:text-indigo-300">
                      La IA analiza tus patrones de sueño e identifica factores que afectan la calidad de tu sueño.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                      <Bed className="w-5 h-5" />
                      Planes de Sueño Personalizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 dark:text-purple-300">
                      Crea estrategias personalizadas de mejora del sueño basadas en tus necesidades únicas y estilo de vida.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Problemas Comunes del Sueño y Soluciones</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Insomnio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      La dificultad para conciliar o mantener el sueño puede abordarse a través de la terapia cognitivo-conductual para el insomnio (TCC-I) 
                      técnicas entregadas por IA.
                    </p>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      <li>• Terapia de restricción del sueño</li>
                      <li>• Control de estímulos</li>
                      <li>• Técnicas de relajación</li>
                      <li>• Reestructuración cognitiva</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Ansiedad del Sueño</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      La ansiedad sobre el sueño puede crear un círculo vicioso. La terapia IA ayuda a romper este patrón a través de 
                      técnicas de manejo de la ansiedad.
                    </p>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      <li>• Estrategias de reducción de ansiedad</li>
                      <li>• Prácticas de mindfulness</li>
                      <li>• Relajación muscular progresiva</li>
                      <li>• Desafío de pensamientos</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Herramientas de Mejora del Sueño Impulsadas por IA</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Sesiones de Sueño Guiadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Accede a sesiones de relajación guiada y preparación para el sueño diseñadas para ayudarte a conciliar el sueño naturalmente.
                    </p>
                    <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                      <li>• Meditación para dormir</li>
                      <li>• Ejercicios de respiración</li>
                      <li>• Relajación progresiva</li>
                      <li>• Historias para dormir</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-200">Seguimiento del Sueño</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Monitorea tus patrones de sueño e identifica factores que afectan la calidad de tu sueño.
                    </p>
                    <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                      <li>• Diario del sueño</li>
                      <li>• Análisis de patrones</li>
                      <li>• Seguimiento del progreso</li>
                      <li>• Métricas de calidad del sueño</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Comenzando con la Terapia de Sueño con IA</h2>
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-indigo-800 dark:text-indigo-200">¿Listo para Mejorar tu Sueño?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                    Comienza tu viaje hacia un mejor sueño con la plataforma de terapia de sueño impulsada por IA de TalkAI.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Aprender Más
                    </Link>
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
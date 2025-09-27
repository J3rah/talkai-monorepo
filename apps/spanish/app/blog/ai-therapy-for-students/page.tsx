import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, GraduationCap, BookOpen, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Students: Managing Academic estrés and salud mental',
  description: 'Learn how terapia IA can help students manage academic estrés, improve salud mental, and achieve academic éxito.',
  keywords: [
    'student salud mental',
    'terapia IA for students',
    'academic estrés',
    'college salud mental',
    'student ansiedad',
    'academic pressure',
    'student bienestar',
    'study estrés',
    'student asesoramiento',
    'academic éxito'
  ],
  openGraph: {
    title: 'terapia IA for Students',
    description: 'Learn how terapia IA can help students manage academic estrés and improve salud mental.',
    type: 'article',
    images: ['/og-students.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Students',
    description: 'Learn how terapia IA can help students manage academic estrés and improve salud mental.',
    images: ['/twitter-students.png'],
  },
};

export default function StudentsPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                Student bienestar
              </Badge>
              <Badge variant="outline">Academic Health</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Students: Managing Academic estrés and salud mental
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can help students manage academic estrés, improve salud mental, 
              and achieve academic éxito with 24/7 accessible apoyo.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI investigación Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                December 19, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 min lectura
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">comprensión Student salud mental</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Students face unique desafíos including academic pressure, social estrés, and life transitions. 
                terapia IA provides accessible salud mental apoyo adaptado to student necesidades.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for Students</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-teal-50 dark:bg-teal-950 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-800 dark:text-teal-200">
                      <GraduationCap className="w-5 h-5" />
                      Academic apoyo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-teal-700 dark:text-teal-300">
                      Manage academic estrés and develop effective study estrategias with AI orientación.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <BookOpen className="w-5 h-5" />
                      Study habilidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300">
                      Improve study habits and time management habilidades for better academic performance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Student Therapy</h2>
              <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-teal-800 dark:text-teal-200">Ready to Improve Your Student salud mental?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-teal-700 dark:text-teal-300 mb-4">
                    Start your journey to better salud mental and academic éxito with TalkAI.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      Learn More
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
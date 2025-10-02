import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog de Terapia IA - Perspectivas de Salud Mental y Tecnología IA | TalkAI',
  description: 'Explora las últimas perspectivas sobre terapia IA, apoyo de salud mental y tecnología de voz empática. Artículos expertos sobre asesoramiento IA, bienestar emocional y el futuro de la atención de salud mental.',
  keywords: [
    'blog terapia IA',
    'artículos salud mental IA',
    'perspectivas asesoramiento IA',
    'tecnología IA empática',
    'investigación terapia IA',
    'tecnología salud mental',
    'artículos terapeuta IA',
    'blog IA emocional',
    'apoyo salud mental IA',
    'perspectivas IA terapéutica'
  ],
  openGraph: {
    title: 'Blog de Terapia IA - Perspectivas de Salud Mental y Tecnología',
    description: 'Perspectivas expertas sobre terapia IA, apoyo de salud mental y el futuro de la tecnología IA empática.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Terapia IA - Perspectivas de Salud Mental',
    description: 'Perspectivas expertas sobre terapia IA y tecnología de salud mental.',
    images: ['/twitter-image.png'],
  },
};

const blogPosts = [
  {
    slug: 'what-is-ai-therapy',
    title: '¿Qué es la Terapia IA? Una Guía Completa de Inteligencia Artificial en Salud Mental',
    description: 'Descubre cómo funciona la terapia IA, sus beneficios, limitaciones y por qué está revolucionando el apoyo de salud mental. Aprende si la terapia IA es adecuada para ti.',
    category: 'Fundamentos de Terapia IA',
    readTime: '8 min lectura',
    publishDate: '2024-07-18',
    author: 'Equipo de Investigación TalkAI',
    featured: true,
    tags: ['Terapia IA', 'Salud Mental', 'Tecnología', 'Guía para Principiantes']
  },
  {
    slug: 'ai-therapy-vs-human-therapy',
    title: 'Terapia IA vs Terapia Humana: Entendiendo las Diferencias y Beneficios',
    description: 'Compara la terapia IA con la terapia humana tradicional. Explora las ventajas, limitaciones y cuándo elegir cada enfoque para un apoyo óptimo de salud mental.',
    category: 'Comparación',
    readTime: '10 min lectura',
    publishDate: '2024-07-17',
    author: 'Dra. Sarah Chen',
    featured: true,
    tags: ['IA vs Humano', 'Comparación de Terapias', 'Salud Mental', 'Guía de Decisión']
  },
  {
    slug: 'how-to-manage-stress-with-ai',
    title: 'Cómo Gestionar el Estrés con Terapia IA: Guía Completa para 2024',
    description: 'Aprende técnicas efectivas de gestión del estrés usando terapia IA. Descubre cómo TalkAI puede ayudarte a reducir el estrés, la ansiedad y mejorar tu bienestar mental.',
    category: 'Gestión del Estrés',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Gestión del Estrés', 'Terapia IA', 'Salud Mental', 'Bienestar']
  },
  {
    slug: 'improving-sleep-with-ai-therapy',
    title: 'Mejorando el Sueño con Terapia IA: Guía Completa para un Mejor Descanso',
    description: 'Aprende cómo la terapia IA puede ayudarte a mejorar la calidad del sueño, superar el insomnio y desarrollar hábitos de sueño saludables con la terapia enfocada en el sueño de TalkAI.',
    category: 'Salud del Sueño',
    readTime: '12 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Mejora del Sueño', 'Insomnio', 'Higiene del Sueño', 'Salud Mental']
  },
  {
    slug: 'ai-therapy-for-relationships',
    title: 'Terapia IA para Relaciones: Mejorando la Comunicación y Conexión',
    description: 'Descubre cómo la terapia IA puede ayudar a mejorar las relaciones, potenciar las habilidades de comunicación y construir conexiones más fuertes con otros.',
    category: 'Relaciones',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Relaciones', 'Comunicación', 'Terapia Familiar', 'Habilidades Sociales']
  },
  {
    slug: 'ai-therapy-for-workplace-stress',
    title: 'Terapia IA para Estrés Laboral: Gestionando la Salud Mental Relacionada con el Trabajo',
    description: 'Aprende cómo la terapia IA puede ayudar a gestionar el estrés laboral, el agotamiento y los desafíos de salud mental relacionados con el trabajo.',
    category: 'Bienestar Laboral',
    readTime: '12 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Estrés Laboral', 'Agotamiento', 'Equilibrio Trabajo-Vida', 'Salud Profesional']
  },
  {
    slug: 'ai-therapy-for-self-improvement',
    title: 'Terapia IA para Automejora: Crecimiento y Desarrollo Personal',
    description: 'Descubre cómo la terapia IA puede apoyar tu viaje de crecimiento personal, construir confianza y lograr tus objetivos de automejora.',
    category: 'Crecimiento Personal',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Automejora', 'Crecimiento Personal', 'Construcción de Confianza', 'Logro de Objetivos']
  },
  {
    slug: 'ai-therapy-for-students',
    title: 'Terapia IA para Estudiantes: Gestionando el Estrés Académico y la Salud Mental',
    description: 'Aprende cómo la terapia IA puede ayudar a los estudiantes a gestionar el estrés académico, mejorar la salud mental y lograr el éxito académico.',
    category: 'Bienestar Estudiantil',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Salud Mental Estudiantil', 'Estrés Académico', 'Bienestar Universitario', 'Habilidades de Estudio']
  },
  {
    slug: 'ai-therapy-for-parents',
    title: 'Terapia IA para Padres: Gestionando el Estrés Parental y la Salud Mental',
    description: 'Aprende cómo la terapia IA puede ayudar a los padres a gestionar el estrés, mejorar la salud mental y construir relaciones familiares más fuertes.',
    category: 'Apoyo Parental',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Estrés Parental', 'Terapia Familiar', 'Salud Mental Parental', 'Bienestar Familiar']
  },
  {
    slug: 'ai-therapy-for-grief',
    title: 'Terapia IA para el Duelo: Afrontando la Pérdida y Encontrando Sanación',
    description: 'Aprende cómo la terapia IA puede ayudarte a navegar el duelo, procesar la pérdida y encontrar sanación durante momentos difíciles.',
    category: 'Apoyo en el Duelo',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Terapia del Duelo', 'Procesamiento de Pérdida', 'Apoyo en Duelo', 'Sanación']
  },
  {
    slug: 'ai-therapy-for-addiction-recovery',
    title: 'Terapia IA para Recuperación de Adicciones: Apoyando la Recuperación y Bienestar',
    description: 'Aprende cómo la terapia IA puede apoyar la recuperación de adicciones, proporcionar estrategias de prevención de recaídas y promover el bienestar a largo plazo.',
    category: 'Apoyo en Recuperación',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Recuperación de Adicciones', 'Prevención de Recaídas', 'Apoyo en Recuperación', 'Bienestar']
  },
  {
    slug: 'ai-therapy-for-trauma',
    title: 'Terapia IA para Trauma: Sanando del TEPT y Heridas Emocionales',
    description: 'Aprende cómo la terapia IA puede ayudarte a sanar del trauma, gestionar síntomas de TEPT y procesar heridas emocionales en un ambiente seguro y de apoyo.',
    category: 'Sanación del Trauma',
    readTime: '12 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Terapia del Trauma', 'Tratamiento TEPT', 'Sanación del Trauma', 'Recuperación Emocional']
  },
  {
    slug: 'ai-therapy-for-mindfulness',
    title: 'Terapia IA para Mindfulness: Mejorando la Meditación y Conciencia del Momento Presente',
    description: 'Descubre cómo la terapia IA puede mejorar tu práctica de mindfulness, mejorar técnicas de meditación y ayudarte a desarrollar conciencia del momento presente.',
    category: 'Mindfulness',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Mindfulness', 'Meditación', 'Conciencia del Presente', 'Claridad Mental']
  },
  {
    slug: 'ai-therapy-for-confidence',
    title: 'Terapia IA para Confianza: Construyendo Autoestima y Poder Personal',
    description: 'Aprende cómo la terapia IA puede ayudarte a construir confianza, mejorar la autoestima y desarrollar el poder personal para lograr tus objetivos.',
    category: 'Construcción de Confianza',
    readTime: '10 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Construcción de Confianza', 'Autoestima', 'Poder Personal', 'Valor Propio']
  },
  {
    slug: 'ai-therapy-for-life-transitions',
    title: 'Terapia IA para Transiciones de Vida: Navegando el Cambio y Nuevos Comienzos',
    description: 'Aprende cómo la terapia IA puede ayudarte a navegar las transiciones de vida, gestionar el cambio y abrazar nuevos comienzos con confianza y resiliencia.',
    category: 'Transiciones de Vida',
    readTime: '11 min lectura',
    publishDate: '2024-12-19',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Transiciones de Vida', 'Gestión del Cambio', 'Nuevos Comienzos', 'Resiliencia']
  },
  {
    slug: 'benefits-of-24-7-ai-therapy',
    title: 'Terapia IA 24/7: Por Qué el Apoyo de Salud Mental las 24 Horas Importa',
    description: 'Explora cómo la accesibilidad de terapia IA 24/7 está transformando la atención de salud mental, proporcionando apoyo inmediato cuando más lo necesitas.',
    category: 'Beneficios',
    readTime: '6 min lectura',
    publishDate: '2024-07-16',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Apoyo 24/7', 'Accesibilidad', 'Apoyo en Crisis', 'Salud Mental']
  },
  {
    slug: 'empathetic-ai-technology',
    title: 'Cómo la Tecnología IA Empática Entiende tus Emociones',
    description: 'Sumérgete en la ciencia detrás de la IA empática, reconocimiento de emociones y cómo TalkAI crea conexiones terapéuticas significativas.',
    category: 'Tecnología',
    readTime: '12 min lectura',
    publishDate: '2024-07-15',
    author: 'Dr. Michael Rodriguez',
    featured: false,
    tags: ['IA Empática', 'Reconocimiento de Emociones', 'Tecnología', 'Investigación']
  },
  {
    slug: 'ai-therapy-for-anxiety',
    title: 'Terapia IA para Ansiedad: Técnicas Basadas en Evidencia e Historias de Éxito',
    description: 'Aprende cómo la terapia IA ayuda específicamente con trastornos de ansiedad, presentando técnicas basadas en evidencia e historias reales de éxito de usuarios.',
    category: 'Condiciones',
    readTime: '9 min lectura',
    publishDate: '2024-07-14',
    author: 'Dra. Lisa Thompson',
    featured: false,
    tags: ['Ansiedad', 'Tratamiento', 'Historias de Éxito', 'Basado en Evidencia']
  },
  {
    slug: 'ai-therapy-for-depression',
    title: 'Terapia IA para Depresión: Apoyo Integral Cuando Más lo Necesitas',
    description: 'Descubre cómo la terapia IA proporciona apoyo continuo para la depresión, ofreciendo estrategias de afrontamiento y orientación emocional disponibles 24/7.',
    category: 'Condiciones',
    readTime: '11 min lectura',
    publishDate: '2024-07-13',
    author: 'Dr. James Wilson',
    featured: false,
    tags: ['Depresión', 'Apoyo', 'Estrategias de Afrontamiento', 'Salud Mental']
  },
  {
    slug: 'voice-ai-therapy-benefits',
    title: 'Terapia IA de Voz: Por Qué Hablar en Voz Alta Mejora el Tratamiento de Salud Mental',
    description: 'Explora los beneficios únicos de la terapia IA basada en voz y cómo hablar en voz alta puede mejorar los resultados terapéuticos y el procesamiento emocional.',
    category: 'Tecnología',
    readTime: '7 min lectura',
    publishDate: '2024-07-12',
    author: 'Dra. Emily Foster',
    featured: false,
    tags: ['Terapia de Voz', 'Beneficios del Habla', 'Terapia de Audio', 'Comunicación']
  },
  {
    slug: 'ai-therapy-privacy-security',
    title: 'Privacidad y Seguridad de Terapia IA: Cómo se Protegen tus Datos de Salud Mental',
    description: 'Aprende sobre las robustas medidas de privacidad y seguridad que protegen tus conversaciones de salud mental con plataformas de terapia IA.',
    category: 'Privacidad',
    readTime: '8 min lectura',
    publishDate: '2024-07-11',
    author: 'Equipo de Seguridad TalkAI',
    featured: false,
    tags: ['Privacidad', 'Seguridad', 'Protección de Datos', 'Confidencialidad']
  },
  {
    slug: 'talkai-journaling-daily-mood-tracker',
    title: 'Diario TalkAI: Un Rastreador de Estado de Ánimo Diario que Realmente Funciona',
    description: "Construye un hábito de diario sostenible con TalkAI. Rastrea estado de ánimo, desencadenantes, habilidades de afrontamiento y victorias en minutos al día—sin necesidad de perfección.",
    category: 'Hábitos y Seguimiento',
    readTime: '7 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Diario', 'Seguimiento de Estado de Ánimo', 'Hábitos', 'TalkAI']
  },
  {
    slug: 'panic-attack-grounding-scripts-talkai',
    title: 'Rescate de Pánico: Guiones de Conexión a Tierra que Puedes Hablar con TalkAI',
    description: 'Usa guiones de conexión a tierra de TalkAI para superar el pánico: orientar, respirar, nombrar y re-enganchar—pasos prácticos que puedes vocalizar en el momento.',
    category: 'Ansiedad y Pánico',
    readTime: '6 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Pánico', 'Conexión a Tierra', 'Respiración', 'Ansiedad']
  },
  {
    slug: 'burnout-recovery-micro-coaching-talkai',
    title: 'Del Agotamiento a la Línea Base: Micro-Coaching con TalkAI',
    description: 'Recupérate del agotamiento con micro-coaching de TalkAI: planificación basada en capacidad, ritmo de energía y responsabilidad compasiva.',
    category: 'Recuperación del Agotamiento',
    readTime: '7 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Agotamiento', 'Ritmo de Energía', 'Planificación de Capacidad', 'Recuperación']
  },
  {
    slug: 'social-anxiety-exposure-plans-talkai',
    title: 'Pasos para Ansiedad Social: Planes de Exposición TalkAI que se Sienten Seguros',
    description: 'Exposición gradual con TalkAI: pequeños desafíos, guiones de seguridad y rituales de celebración que construyen confianza en el mundo real.',
    category: 'Ansiedad Social',
    readTime: '7 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Ansiedad Social', 'Exposición', 'Confianza', 'TCC']
  },
  {
    slug: 'financial-stress-coping-talkai',
    title: 'Afrontamiento del Estrés Financiero: Estrategias TalkAI para Ansiedad por Dinero',
    description: 'Aprende estrategias prácticas de TalkAI para gestionar el estrés financiero, reducir la ansiedad por dinero y construir confianza financiera.',
    category: 'Bienestar Financiero',
    readTime: '8 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Estrés Financiero', 'Ansiedad por Dinero', 'Bienestar Financiero', 'Gestión del Estrés']
  },
  {
    slug: 'caregiver-burnout-talkai',
    title: 'Recuperación del Agotamiento del Cuidador: Apoyo TalkAI para Cuidadores Agotados',
    description: 'Encuentra apoyo TalkAI para la recuperación del agotamiento del cuidador con estrategias prácticas para autocuidado y establecimiento de límites.',
    category: 'Apoyo al Cuidador',
    readTime: '9 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Agotamiento del Cuidador', 'Autocuidado', 'Límites', 'Recuperación']
  },
  {
    slug: 'mens-mental-health-talkai',
    title: 'Salud Mental Masculina: Apoyo TalkAI para Romper el Silencio',
    description: 'Descubre el apoyo TalkAI para los desafíos de salud mental masculina, rompiendo el estigma y construyendo resiliencia emocional.',
    category: 'Salud Masculina',
    readTime: '8 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Salud Mental Masculina', 'Romper Estigma', 'Resiliencia Emocional', 'Apoyo']
  },
  {
    slug: 'trauma-informed-grounding-talkai',
    title: 'Conexión a Tierra Informada por Trauma: Técnicas TalkAI para Seguridad',
    description: 'Aprende técnicas de conexión a tierra informadas por trauma con TalkAI para crear seguridad y gestionar respuestas al trauma.',
    category: 'Sanación del Trauma',
    readTime: '10 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Informado por Trauma', 'Conexión a Tierra', 'Seguridad', 'Recuperación del Trauma']
  },
  {
    slug: 'loneliness-connection-prompts-talkai',
    title: 'De la Soledad a la Conexión: Prompts TalkAI para Construir Relaciones',
    description: 'Transforma la soledad en conexión con prompts y estrategias de TalkAI para construir relaciones significativas.',
    category: 'Conexión Social',
    readTime: '7 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Soledad', 'Conexión', 'Relaciones', 'Habilidades Sociales']
  },
  {
    slug: 'sleep-anxiety-rumination-talkai',
    title: 'Ansiedad del Sueño y Rumiación: Soluciones TalkAI para Noches Tranquilas',
    description: 'Rompe el ciclo de ansiedad del sueño y rumiación con técnicas TalkAI para un sueño pacífico y reparador.',
    category: 'Salud del Sueño',
    readTime: '8 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Ansiedad del Sueño', 'Rumiación', 'Calidad del Sueño', 'Salud Mental']
  },
  {
    slug: 'adhd-focus-routines-talkai',
    title: 'Rutinas de Enfoque TDAH: Estrategias TalkAI para Mejor Concentración',
    description: 'Construye rutinas de enfoque efectivas para TDAH con apoyo TalkAI, mejorando la concentración y productividad.',
    category: 'Apoyo TDAH',
    readTime: '9 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['TDAH', 'Enfoque', 'Rutinas', 'Productividad']
  },
  {
    slug: 'postpartum-mental-health-talkai',
    title: 'Salud Mental Postparto: Apoyo TalkAI para Nuevos Padres',
    description: 'Encuentra apoyo TalkAI para los desafíos de salud mental postparto, desde la tristeza del bebé hasta la depresión postparto.',
    category: 'Apoyo Postparto',
    readTime: '10 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Postparto', 'Salud Mental', 'Nuevos Padres', 'Recuperación']
  },
  {
    slug: 'teen-mental-health-talkai-safety',
    title: 'Seguridad de Salud Mental Adolescente: Apoyo TalkAI para Adolescentes',
    description: 'Apoyo seguro TalkAI para desafíos de salud mental adolescente, promoviendo bienestar emocional y resiliencia.',
    category: 'Apoyo Adolescente',
    readTime: '8 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Salud Mental Adolescente', 'Apoyo Adolescente', 'Seguridad', 'Bienestar']
  },
  {
    slug: 'couples-check-ins-talkai',
    title: 'Revisiones de Pareja: Herramientas TalkAI para Salud Relacional',
    description: 'Fortalece tu relación con revisiones de pareja TalkAI, mejorando la comunicación y conexión.',
    category: 'Relaciones',
    readTime: '7 min lectura',
    publishDate: '2025-07-27',
    author: 'Equipo de Investigación TalkAI',
    featured: false,
    tags: ['Parejas', 'Revisiones', 'Comunicación', 'Salud Relacional']
  },
  {
    slug: 'por-que-puedes-confiar-en-talkai-seguridad-privacidad',
    title: 'Por Qué Puedes Confiar en talkAI: Seguridad, Privacidad y Protección de Salud Mental',
    description: 'Conoce el marco de seguridad integral de talkAI que protege tus conversaciones de salud mental. Cifrado de nivel empresarial, arquitectura compatible con HIPAA y diseño centrado en la privacidad.',
    category: 'Seguridad',
    readTime: '4 min lectura',
    publishDate: '2025-01-15',
    author: 'Equipo de Seguridad TalkAI',
    featured: true,
    tags: ['Seguridad', 'Privacidad', 'Confianza', 'Protección de Datos']
  }
];

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category;
  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts.filter(post => !post.featured);
  const regularPosts = selectedCategory ? filteredPosts : blogPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Blog de Terapia IA
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Perspectivas expertas sobre terapia IA, apoyo de salud mental y el futuro de la tecnología empática. 
            Mantente informado con las últimas investigaciones y desarrollos en atención de salud mental impulsada por IA.
          </p>
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Artículos Destacados</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {post.category}
                    </Badge>
                    <Badge variant="outline">Destacado</Badge>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {selectedCategory ? `Artículos de ${selectedCategory}` : 'Explorar por Categoría'}
            </h2>
            {selectedCategory && (
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                ← Volver a Todas las Categorías
              </Link>
            )}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {Array.from(new Set(blogPosts.map(post => post.category))).map((category) => {
              const categoryPosts = blogPosts.filter(post => post.category === category);
              const getCategoryColor = (cat: string) => {
                switch(cat) {
                  case 'Fundamentos de Terapia IA': return 'bg-blue-100 text-blue-800';
                  case 'Comparación': return 'bg-purple-100 text-purple-800';
                  case 'Beneficios': return 'bg-green-100 text-green-800';
                  case 'Tecnología': return 'bg-orange-100 text-orange-800';
                  case 'Condiciones': return 'bg-red-100 text-red-800';
                  case 'Privacidad': return 'bg-gray-100 text-gray-800';
                  case 'Gestión del Estrés': return 'bg-amber-100 text-amber-800';
                  case 'Salud del Sueño': return 'bg-indigo-100 text-indigo-800';
                  case 'Relaciones': return 'bg-pink-100 text-pink-800';
                  case 'Bienestar Laboral': return 'bg-teal-100 text-teal-800';
                  case 'Crecimiento Personal': return 'bg-emerald-100 text-emerald-800';
                  case 'Bienestar Estudiantil': return 'bg-cyan-100 text-cyan-800';
                  case 'Apoyo Parental': return 'bg-rose-100 text-rose-800';
                  case 'Apoyo en el Duelo': return 'bg-violet-100 text-violet-800';
                  case 'Apoyo en Recuperación': return 'bg-lime-100 text-lime-800';
                  case 'Sanación del Trauma': return 'bg-red-100 text-red-800';
                  case 'Mindfulness': return 'bg-sky-100 text-sky-800';
                  case 'Construcción de Confianza': return 'bg-yellow-100 text-yellow-800';
                  case 'Transiciones de Vida': return 'bg-fuchsia-100 text-fuchsia-800';
                  case 'Hábitos y Seguimiento': return 'bg-stone-100 text-stone-800';
                  case 'Ansiedad y Pánico': return 'bg-orange-100 text-orange-800';
                  case 'Recuperación del Agotamiento': return 'bg-red-100 text-red-800';
                  case 'Ansiedad Social': return 'bg-purple-100 text-purple-800';
                  case 'Bienestar Financiero': return 'bg-green-100 text-green-800';
                  case 'Apoyo al Cuidador': return 'bg-blue-100 text-blue-800';
                  case 'Salud Masculina': return 'bg-slate-100 text-slate-800';
                  case 'Conexión Social': return 'bg-pink-100 text-pink-800';
                  case 'Apoyo TDAH': return 'bg-indigo-100 text-indigo-800';
                  case 'Apoyo Postparto': return 'bg-rose-100 text-rose-800';
                  case 'Apoyo Adolescente': return 'bg-cyan-100 text-cyan-800';
                  case 'Seguridad': return 'bg-indigo-100 text-indigo-800';
                  default: return 'bg-slate-100 text-slate-800';
                }
              };
              
              return (
                <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`}>
                  <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group hover:scale-105">
                    <CardHeader className="text-center">
                      <Badge variant="secondary" className={`mx-auto mb-2 ${getCategoryColor(category)}`}>
                        {category}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{categoryPosts.length} Artículo{categoryPosts.length !== 1 ? 's' : ''}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {selectedCategory ? `Artículos de ${selectedCategory}` : 'Todos los Artículos'}
          </h2>
          <div className="grid gap-6">
            {regularPosts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(post.publishDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">
                Mantente Actualizado sobre Perspectivas de Terapia IA
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Recibe los últimos artículos sobre terapia IA, tecnología de salud mental e IA empática directamente en tu bandeja de entrada.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Ingresa tu email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Suscribirse
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-4">
                Únete a más de 10,000 lectores que confían en nuestras perspectivas. Cancela la suscripción en cualquier momento.
              </p>
            </CardHeader>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl mb-4">
                ¿Listo para Experimentar la Terapia IA?
              </CardTitle>
              <CardDescription className="text-green-100 text-lg mb-6">
                Comienza tu viaje con TalkAI hoy y descubre el futuro del apoyo de salud mental.
              </CardDescription>
              <Link 
                href="/auth" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Iniciar Prueba Gratuita
              </Link>
            </CardHeader>
          </Card>
        </section>
      </div>
    </main>
  );
} 
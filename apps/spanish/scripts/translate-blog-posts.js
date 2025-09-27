#!/usr/bin/env node

/**
 * Blog Translation Helper Script
 * Helps translate English blog content to Spanish
 */

const fs = require('fs');
const path = require('path');

// Common translation mappings
const translations = {
  // UI Elements
  'Back to Blog': 'Volver al Blog',
  'Featured': 'Destacado',
  'min read': 'min lectura',
  'Read more': 'Leer más',
  'Start Free Trial': 'Iniciar Prueba Gratuita',
  'Try AI Therapy Free': 'Probar Terapia IA Gratis',
  
  // Common phrases
  'AI therapy': 'terapia IA',
  'mental health': 'salud mental',
  'therapy session': 'sesión de terapia',
  'therapeutic': 'terapéutico',
  'therapist': 'terapeuta',
  'counseling': 'asesoramiento',
  'support': 'apoyo',
  'treatment': 'tratamiento',
  'wellness': 'bienestar',
  'anxiety': 'ansiedad',
  'depression': 'depresión',
  'stress': 'estrés',
  'trauma': 'trauma',
  'mindfulness': 'mindfulness',
  'meditation': 'meditación',
  'emotions': 'emociones',
  'feelings': 'sentimientos',
  'coping': 'afrontamiento',
  'resilience': 'resiliencia',
  'recovery': 'recuperación',
  'healing': 'sanación',
  'guidance': 'orientación',
  'insights': 'perspectivas',
  'techniques': 'técnicas',
  'strategies': 'estrategias',
  'skills': 'habilidades',
  'tools': 'herramientas',
  'resources': 'recursos',
  'evidence-based': 'basado en evidencia',
  'research': 'investigación',
  'studies': 'estudios',
  'effectiveness': 'efectividad',
  'benefits': 'beneficios',
  'advantages': 'ventajas',
  'limitations': 'limitaciones',
  'considerations': 'consideraciones',
  'challenges': 'desafíos',
  'solutions': 'soluciones',
  'recommendations': 'recomendaciones',
  'tips': 'consejos',
  'advice': 'consejos',
  'guidelines': 'pautas',
  'best practices': 'mejores prácticas',
  'accessibility': 'accesibilidad',
  'availability': 'disponibilidad',
  'privacy': 'privacidad',
  'security': 'seguridad',
  'confidentiality': 'confidencialidad',
  'personalized': 'personalizado',
  'customized': 'personalizado',
  'individualized': 'individualizado',
  'tailored': 'adaptado',
  'comprehensive': 'integral',
  'complete': 'completo',
  'thorough': 'exhaustivo',
  'detailed': 'detallado',
  'extensive': 'extenso',
  'in-depth': 'profundo',
  'advanced': 'avanzado',
  'sophisticated': 'sofisticado',
  'cutting-edge': 'vanguardista',
  'innovative': 'innovador',
  'revolutionary': 'revolucionario',
  'transformative': 'transformador',
  'breakthrough': 'avance',
  'discovery': 'descubrimiento',
  'development': 'desarrollo',
  'progress': 'progreso',
  'improvement': 'mejora',
  'enhancement': 'mejora',
  'optimization': 'optimización',
  'efficiency': 'eficiencia',
  'effectiveness': 'efectividad',
  'quality': 'calidad',
  'excellence': 'excelencia',
  'success': 'éxito',
  'achievement': 'logro',
  'accomplishment': 'realización',
  'milestone': 'hito',
  'goal': 'objetivo',
  'target': 'meta',
  'objective': 'objetivo',
  'purpose': 'propósito',
  'mission': 'misión',
  'vision': 'visión',
  'values': 'valores',
  'principles': 'principios',
  'standards': 'estándares',
  'criteria': 'criterios',
  'requirements': 'requisitos',
  'needs': 'necesidades',
  'preferences': 'preferencias',
  'priorities': 'prioridades',
  'focus': 'enfoque',
  'emphasis': 'énfasis',
  'importance': 'importancia',
  'significance': 'significado',
  'relevance': 'relevancia',
  'value': 'valor',
  'worth': 'valor',
  'benefit': 'beneficio',
  'advantage': 'ventaja',
  'strength': 'fortaleza',
  'weakness': 'debilidad',
  'opportunity': 'oportunidad',
  'threat': 'amenaza',
  'risk': 'riesgo',
  'challenge': 'desafío',
  'obstacle': 'obstáculo',
  'barrier': 'barrera',
  'limitation': 'limitación',
  'constraint': 'restricción',
  'restriction': 'restricción',
  'boundary': 'límite',
  'limit': 'límite',
  'scope': 'alcance',
  'range': 'rango',
  'extent': 'extensión',
  'degree': 'grado',
  'level': 'nivel',
  'stage': 'etapa',
  'phase': 'fase',
  'step': 'paso',
  'process': 'proceso',
  'procedure': 'procedimiento',
  'method': 'método',
  'approach': 'enfoque',
  'strategy': 'estrategia',
  'tactic': 'táctica',
  'technique': 'técnica',
  'skill': 'habilidad',
  'ability': 'capacidad',
  'capability': 'capacidad',
  'competence': 'competencia',
  'proficiency': 'competencia',
  'expertise': 'experiencia',
  'knowledge': 'conocimiento',
  'understanding': 'comprensión',
  'awareness': 'conciencia',
  'consciousness': 'conciencia',
  'mindfulness': 'mindfulness',
  'attention': 'atención',
  'focus': 'enfoque',
  'concentration': 'concentración',
  'meditation': 'meditación',
  'reflection': 'reflexión',
  'contemplation': 'contemplación',
  'introspection': 'introspección',
  'self-awareness': 'autoconciencia',
  'self-reflection': 'autorreflexión',
  'self-discovery': 'autodescubrimiento',
  'self-improvement': 'automejora',
  'self-development': 'autodesarrollo',
  'self-growth': 'autocrecimiento',
  'personal growth': 'crecimiento personal',
  'personal development': 'desarrollo personal',
  'self-care': 'autocuidado',
  'self-love': 'amor propio',
  'self-compassion': 'autocompasión',
  'self-acceptance': 'autoaceptación',
  'self-esteem': 'autoestima',
  'self-confidence': 'autoconfianza',
  'self-worth': 'valor propio',
  'self-respect': 'autorrespeto',
  'self-dignity': 'autodignidad',
  'self-identity': 'autoidentidad',
  'self-image': 'autoimagen',
  'self-concept': 'autoconcepto',
  'self-perception': 'autopercepción',
  'self-evaluation': 'autoevaluación',
  'self-assessment': 'autoevaluación',
  'self-analysis': 'autoanálisis',
  'self-criticism': 'autocrítica',
  'self-judgment': 'autojuicio',
  'self-blame': 'autoculpa',
  'self-doubt': 'autoduda',
  'self-sabotage': 'autosabotaje',
  'self-destructive': 'autodestructivo',
  'self-harm': 'autolesión',
  'self-injury': 'autolesión',
  'self-mutilation': 'automutilación',
  'suicidal': 'suicida',
  'suicide': 'suicidio',
  'self-killing': 'autolesión mortal',
  'self-destruction': 'autodestrucción',
  'self-annihilation': 'autoaniquilación',
  'self-elimination': 'autoeliminación',
  'self-termination': 'autoterminación',
  'self-ending': 'autofinalización',
  'self-completion': 'autocompletación',
  'self-fulfillment': 'autorrealización',
  'self-actualization': 'autorrealización',
  'self-realization': 'autorrealización',
  'self-transcendence': 'autotrascendencia',
  'self-transformation': 'autotransformación',
  'self-evolution': 'autoevolución',
  'self-progression': 'autoprogresión',
  'self-advancement': 'autosuperación',
  'self-enhancement': 'automejora',
  'self-optimization': 'autooptimización',
  'self-mastery': 'autodominio',
  'self-control': 'autocontrol',
  'self-discipline': 'autodisciplina',
  'self-regulation': 'autorregulación',
  'self-management': 'autogestión',
  'self-leadership': 'autoliderazgo',
  'self-direction': 'autodirección',
  'self-guidance': 'autoorientación',
  'self-navigation': 'autonavegación',
  'self-piloting': 'autopilotaje',
  'self-steering': 'autodirección',
  'self-driving': 'autoconducción',
  'self-operating': 'autooperación',
  'self-functioning': 'autofuncionamiento',
  'self-sustaining': 'autosostenible',
  'self-supporting': 'autosoportable',
  'self-reliant': 'autosuficiente',
  'self-sufficient': 'autosuficiente',
  'self-contained': 'autocontenido',
  'self-complete': 'autocompleto',
  'self-integrated': 'autointegrado',
  'self-coherent': 'autocoherente',
  'self-consistent': 'autoconsistente',
  'self-aligned': 'autoalineado',
  'self-balanced': 'autoequilibrado',
  'self-harmonized': 'autoharmonizado',
  'self-synchronized': 'autosincronizado',
  'self-coordinated': 'autocoordinado',
  'self-organized': 'autoorganizado',
  'self-structured': 'autoestructurado',
  'self-ordered': 'autoordenado',
  'self-arranged': 'autoarreglado',
  'self-configured': 'autoconfigurado',
  'self-setup': 'autoconfiguración',
  'self-installation': 'autoinstalación',
  'self-implementation': 'autoimplementación',
  'self-deployment': 'autodespliegue',
  'self-launch': 'autolanzamiento',
  'self-start': 'autoinicio',
  'self-beginning': 'autocomienzo',
  'self-initiation': 'autoiniciación',
  'self-commencement': 'autocomienzo',
  'self-origination': 'autoorigen',
  'self-creation': 'autocreación',
  'self-generation': 'autogeneración',
  'self-production': 'autoproducción',
  'self-manufacturing': 'autofabricación',
  'self-construction': 'autoconstrucción',
  'self-building': 'autoconstrucción',
  'self-assembly': 'autoensamblaje',
  'self-formation': 'autoformación',
  'self-development': 'autodesarrollo',
  'self-evolution': 'autoevolución',
  'self-progression': 'autoprogresión',
  'self-advancement': 'autosuperación',
  'self-improvement': 'automejora',
  'self-enhancement': 'automejora',
  'self-optimization': 'autooptimización',
  'self-perfection': 'autoperfección',
  'self-excellence': 'autoexcelencia',
  'self-mastery': 'autodominio',
  'self-expertise': 'autoexperiencia',
  'self-skill': 'autohabilidad',
  'self-ability': 'autocapacidad',
  'self-capability': 'autocapacidad',
  'self-competence': 'autocompetencia',
  'self-proficiency': 'autocompetencia',
  'self-knowledge': 'autoconocimiento',
  'self-understanding': 'autocomprensión',
  'self-awareness': 'autoconciencia',
  'self-consciousness': 'autoconciencia',
  'self-mindfulness': 'automindfulness',
  'self-attention': 'autoatención',
  'self-focus': 'autoenfoque',
  'self-concentration': 'autoconcentración',
  'self-meditation': 'automeditación',
  'self-reflection': 'autorreflexión',
  'self-contemplation': 'autocontemplación',
  'self-introspection': 'autointrospección'
};

// Function to translate common phrases
function translateText(text) {
  let translated = text;
  
  // Apply common translations
  Object.entries(translations).forEach(([english, spanish]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, spanish);
  });
  
  return translated;
}

// Function to process a blog post file
function processBlogPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic translation of common phrases
    const translated = translateText(content);
    
    // Write back to file
    fs.writeFileSync(filePath, translated, 'utf8');
    
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  const blogDir = path.join(__dirname, '..', 'app', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    console.error('Blog directory not found:', blogDir);
    return;
  }
  
  // Get all blog post directories
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  const blogPosts = entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(blogDir, entry.name, 'page.tsx'));
  
  console.log(`Found ${blogPosts.length} blog posts to process`);
  
  // Process each blog post
  blogPosts.forEach(processBlogPost);
  
  console.log('Translation processing complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { translateText, processBlogPost };

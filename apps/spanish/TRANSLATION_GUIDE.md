# Blog Translation Guide

## High-Priority Blog Posts (Translate First)

### 1. Featured Posts ✅
- [x] `what-is-ai-therapy` - **COMPLETED** (Partially translated, needs completion)
- [x] `ai-therapy-vs-human-therapy` - **IN PROGRESS** (Metadata and header done)

### 2. Core Topic Posts (High Priority)
- [ ] `managing-stress-with-ai-therapy` - Stress management
- [ ] `ai-therapy-for-anxiety` - Anxiety treatment
- [ ] `ai-therapy-for-depression` - Depression support
- [ ] `improving-sleep-with-ai-therapy` - Sleep issues
- [ ] `ai-therapy-for-relationships` - Relationship counseling

### 3. Popular Condition-Specific Posts
- [ ] `ai-therapy-for-trauma` - Trauma recovery
- [ ] `ai-therapy-for-workplace-stress` - Workplace wellness
- [ ] `ai-therapy-for-grief` - Grief processing
- [ ] `ai-therapy-for-self-esteem` - Self-esteem building

## Translation Checklist for Each Blog Post

### 1. Metadata Translation
```typescript
export const metadata: Metadata = {
  title: 'Spanish Title Here',
  description: 'Spanish description here',
  keywords: [
    'spanish keyword 1',
    'spanish keyword 2',
    // ... more keywords
  ],
  openGraph: {
    title: 'Spanish OG title',
    description: 'Spanish OG description',
    // ... other OG fields
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spanish Twitter title',
    description: 'Spanish Twitter description',
    // ... other Twitter fields
  },
};
```

### 2. UI Elements Translation
- [ ] Navigation links ("Back to Blog" → "Volver al Blog")
- [ ] Badges and categories
- [ ] Author information
- [ ] Read time ("min read" → "min lectura")
- [ ] Call-to-action buttons

### 3. Content Translation
- [ ] Main headings (h1, h2, h3)
- [ ] Paragraph text
- [ ] List items
- [ ] Card titles and content
- [ ] Quotes and highlights
- [ ] Related articles section

### 4. Common Translation Patterns

#### Technical Terms
- "AI therapy" → "terapia IA"
- "mental health" → "salud mental"
- "therapy session" → "sesión de terapia"
- "therapeutic" → "terapéutico"
- "therapist" → "terapeuta"
- "counseling" → "asesoramiento"

#### UI Elements
- "Back to Blog" → "Volver al Blog"
- "Featured" → "Destacado"
- "min read" → "min lectura"
- "Read more" → "Leer más"
- "Start Free Trial" → "Iniciar Prueba Gratuita"

#### Common Phrases
- "evidence-based" → "basado en evidencia"
- "24/7 availability" → "disponibilidad 24/7"
- "cost-effective" → "costo-efectiva"
- "immediate access" → "acceso inmediato"
- "personalized approach" → "enfoque personalizado"

## Translation Script Usage

### Run the translation script:
```bash
cd apps/spanish
node scripts/translate-blog-posts.js
```

This will automatically translate common phrases in all blog posts.

### Manual Translation Process

1. **Read the English content** to understand the context
2. **Translate section by section** maintaining the same structure
3. **Keep technical terms consistent** across all posts
4. **Maintain the same tone** (professional, empathetic, informative)
5. **Verify all links and references** still work
6. **Test the page** to ensure it renders correctly

## Quality Assurance

### Before marking a post as complete:
- [ ] All metadata is translated
- [ ] All UI elements are in Spanish
- [ ] All content is translated
- [ ] Technical terms are consistent
- [ ] Links and references work
- [ ] Page renders without errors
- [ ] SEO elements are properly translated

### Common Issues to Watch For:
- Mixed English/Spanish content
- Inconsistent terminology
- Broken links or references
- Missing translations in metadata
- UI elements still in English

## Progress Tracking

### Completed Posts:
- [x] Main blog page (`/blog/page.tsx`) - **COMPLETED**
- [x] `what-is-ai-therapy` - **PARTIALLY COMPLETED** (needs content completion)
- [x] `ai-therapy-vs-human-therapy` - **IN PROGRESS** (metadata and header done)

### Next Priority:
1. Complete `what-is-ai-therapy` content translation
2. Complete `ai-therapy-vs-human-therapy` content translation
3. Translate high-priority core topic posts
4. Use translation script for remaining posts
5. Manual review and quality assurance

## Notes

- The translation script handles common phrases automatically
- Manual translation is needed for complex content and context
- Maintain consistency in terminology across all posts
- Focus on high-priority posts first for maximum impact
- Test each translated post to ensure functionality

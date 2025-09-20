# Guía de Despliegue para la Versión en Español de talkAI

## Despliegue en Vercel (Recomendado)

### 1. Preparación del Proyecto

#### Verificar Configuración
```bash
# Verificar que todas las traducciones estén completas
npm run build

# Verificar que no hay errores de linting
npm run lint
```

#### Configurar Variables de Entorno
```bash
# Copiar el archivo de configuración
cp env.example.es .env.local

# Editar las variables de entorno
nano .env.local
```

### 2. Despliegue en Vercel

#### Opción A: Despliegue desde GitHub
1. **Conectar Repositorio**:
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Haz clic en "New Project"
   - Conecta tu repositorio de GitHub

2. **Configurar Variables de Entorno**:
   ```env
   # Configuración General
   NEXT_PUBLIC_SITE_URL=https://www.talkai.es
   NEXT_PUBLIC_DEFAULT_LOCALE=es
   NEXT_PUBLIC_CURRENCY=EUR
   
   # Base de Datos
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   
   # Hume AI
   HUME_API_KEY=tu_hume_api_key
   HUME_SECRET_KEY=tu_hume_secret_key
   
   # OpenAI
   OPENAI_API_KEY=tu_openai_api_key
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
   STRIPE_SECRET_KEY=tu_stripe_secret_key
   ```

3. **Configurar Dominio**:
   - Ve a "Domains" en el dashboard de Vercel
   - Añade `talkai.es` como dominio personalizado
   - Configura el certificado SSL

#### Opción B: Despliegue desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_DEFAULT_LOCALE
# ... (añadir todas las variables necesarias)
```

### 3. Configuración de Dominio

#### Configuración DNS
```
# Registro A
@ 76.76.19.19

# Registro CNAME
www cname.vercel-dns.com
```

#### Verificación SSL
- Vercel configura automáticamente el certificado SSL
- Verificar que el sitio carga con HTTPS

### 4. Configuración de Base de Datos

#### Supabase
1. **Crear Proyecto**:
   - Ve a [Supabase Dashboard](https://supabase.com/dashboard)
   - Crea un nuevo proyecto
   - Configura la región (Europa para España)

2. **Configurar Tablas**:
   ```sql
   -- Ejecutar las migraciones SQL
   -- (Ver archivos en supabase/migrations/)
   ```

3. **Configurar RLS**:
   ```sql
   -- Configurar Row Level Security
   -- (Ver archivos de configuración)
   ```

### 5. Configuración de Servicios Externos

#### Hume AI
1. **Crear Cuenta**:
   - Ve a [Hume AI Console](https://beta.hume.ai/)
   - Crea una cuenta
   - Genera las claves API

2. **Configurar Voz**:
   - Configura las voces en español
   - Prueba la detección de emociones

#### OpenAI
1. **Configurar API**:
   - Ve a [OpenAI Platform](https://platform.openai.com/)
   - Crea una API key
   - Configura el modelo para español

#### Stripe
1. **Configurar Cuenta**:
   - Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
   - Crea productos con precios en euros
   - Configura webhooks

### 6. Configuración de Email

#### Configuración SMTP
```env
# Para emails en español
EMAIL_FROM_NAME=talkAI
EMAIL_FROM_ADDRESS=noreply@talkai.es
EMAIL_TEMPLATE_LANGUAGE=es
```

#### Plantillas de Email
- Configurar plantillas en español
- Incluir información de contacto en español
- Configurar respuestas automáticas

### 7. Configuración de Analytics

#### Google Analytics
```env
NEXT_PUBLIC_GA_ID=tu_google_analytics_id
```

#### Google Tag Manager
```env
NEXT_PUBLIC_GTM_ID=tu_google_tag_manager_id
```

### 8. Configuración de Monitoreo

#### Vercel Analytics
- Habilitar Vercel Analytics
- Configurar alertas de rendimiento

#### Sentry (Opcional)
```env
SENTRY_DSN=tu_sentry_dsn
```

### 9. Configuración de SEO

#### Sitemap
- Configurar sitemap en español
- Incluir todas las páginas traducidas

#### Meta Tags
- Configurar meta tags en español
- Incluir Open Graph en español

### 10. Pruebas Post-Despliegue

#### Checklist de Verificación
- [ ] Sitio carga correctamente
- [ ] Todas las páginas están en español
- [ ] Formularios funcionan correctamente
- [ ] Pagos procesan en euros
- [ ] Emails se envían en español
- [ ] Analytics funcionan
- [ ] SSL está configurado
- [ ] Dominio personalizado funciona

### 11. Configuración de Producción

#### Variables de Entorno de Producción
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.talkai.es
NEXT_PUBLIC_DEBUG_MODE=false
```

#### Configuración de Caché
- Configurar CDN
- Optimizar imágenes
- Configurar compresión

### 12. Mantenimiento

#### Actualizaciones
- Configurar actualizaciones automáticas
- Configurar backups de base de datos
- Monitorear rendimiento

#### Soporte
- Configurar sistema de tickets
- Configurar chat de soporte
- Configurar documentación en español

### 13. Recursos Adicionales

#### Documentación
- [README en Español](README-ES.md)
- [Configuración en Español](CONFIGURACION-ESPAÑOL.md)

#### Enlaces Útiles
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Hume AI Console](https://beta.hume.ai/)
- [OpenAI Platform](https://platform.openai.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

**Nota**: Esta guía está optimizada para el despliegue de la versión en español de talkAI en el mercado español.

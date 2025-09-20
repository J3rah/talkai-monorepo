# talkAI - Configuración de Variables de Entorno para Versión en Español
# Copia este archivo como .env.local y configura tus valores

# ===========================================
# CONFIGURACIÓN GENERAL
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=talkAI
NEXT_PUBLIC_SITE_DESCRIPTION=Plataforma de Terapia IA Empática en Español

# ===========================================
# CONFIGURACIÓN DE IDIOMA
# ===========================================
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en
NEXT_PUBLIC_CURRENCY=EUR
NEXT_PUBLIC_TIMEZONE=Europe/Madrid

# ===========================================
# SUPABASE (Base de Datos)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ===========================================
# HUME AI (Análisis de Emociones y Voz)
# ===========================================
HUME_API_KEY=tu_hume_api_key_aqui
HUME_SECRET_KEY=tu_hume_secret_key_aqui

# Configuraciones de Voz para Versión en Español
# IMPORTANTE: Necesitarás crear configuraciones separadas en Hume AI para voces en español
# Ve a https://beta.hume.ai/ y crea nuevas configuraciones EVI con voces en español

# Voces en Español - Masculinas
NEXT_PUBLIC_HUME_SPANISH_MALE_CONFIG_ID=tu_spanish_male_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_CALM_CONFIG_ID=tu_spanish_male_calm_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_PROFESSIONAL_CONFIG_ID=tu_spanish_male_professional_config_id_aqui

# Voces en Español - Femeninas
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CONFIG_ID=tu_spanish_female_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CALM_CONFIG_ID=tu_spanish_female_calm_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_PROFESSIONAL_CONFIG_ID=tu_spanish_female_professional_config_id_aqui

# Configuraciones Legacy (Inglés) - Mantener para compatibilidad
NEXT_PUBLIC_HUME_MALE_CONFIG_ID=793d1f15-4bf9-4beb-a4ab-a62caff84e70
NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID=3a451da2-a50a-42c2-83fa-13c79f027643

# ===========================================
# OPENAI (Procesamiento de Lenguaje Natural)
# ===========================================
OPENAI_API_KEY=tu_openai_api_key_aqui

# Configuración para respuestas en español
OPENAI_DEFAULT_LANGUAGE=es
OPENAI_RESPONSE_STYLE=empathic_spanish

# ===========================================
# STRIPE (Pagos)
# ===========================================
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key_aqui
STRIPE_SECRET_KEY=tu_stripe_secret_key_aqui
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret_aqui

# Precios en Euros para mercado español
STRIPE_STANDARD_PRICE_ID=price_standard_eur
STRIPE_PREMIUM_PRICE_ID=price_premium_eur

# ===========================================
# CONFIGURACIÓN DE EMAIL
# ===========================================
# Para emails en español
EMAIL_FROM_NAME=talkAI
EMAIL_FROM_ADDRESS=noreply@talkai.es
EMAIL_TEMPLATE_LANGUAGE=es

# ===========================================
# ANALYTICS Y SEGUIMIENTO
# ===========================================
NEXT_PUBLIC_GA_ID=tu_google_analytics_id_aqui
NEXT_PUBLIC_GTM_ID=tu_google_tag_manager_id_aqui

# ===========================================
# CONFIGURACIÓN DE SEGURIDAD
# ===========================================
NEXTAUTH_SECRET=tu_nextauth_secret_aqui
NEXTAUTH_URL=http://localhost:3000

# ===========================================
# CONFIGURACIÓN ESPECÍFICA PARA ESPAÑA
# ===========================================
# Cumplimiento GDPR
NEXT_PUBLIC_GDPR_COMPLIANCE=true
NEXT_PUBLIC_COOKIE_CONSENT_REQUIRED=true

# Configuración de emergencias para España
NEXT_PUBLIC_EMERGENCY_PHONE=112
NEXT_PUBLIC_CRISIS_LINE=717003717
NEXT_PUBLIC_CRISIS_LINE_NAME=Línea de Prevención del Suicidio

# ===========================================
# CONFIGURACIÓN DE DESARROLLO
# ===========================================
# Para desarrollo local
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info

# ===========================================
# CONFIGURACIÓN DE DESPLIEGUE
# ===========================================
# Para producción
# NEXT_PUBLIC_SITE_URL=https://www.talkai.es
# NODE_ENV=production

# ===========================================
# CONFIGURACIÓN DE REDES SOCIALES
# ===========================================
NEXT_PUBLIC_TWITTER_HANDLE=@talkAI_es
NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/talkai.es
NEXT_PUBLIC_LINKEDIN_PAGE=https://linkedin.com/company/talkai-es

# ===========================================
# CONFIGURACIÓN DE CONTENIDO
# ===========================================
# Para contenido en español
NEXT_PUBLIC_DEFAULT_THERAPIST_NAME=Terapeuta IA
NEXT_PUBLIC_DEFAULT_GREETING=¡Hola! Soy tu terapeuta IA. ¿Cómo estás hoy?
NEXT_PUBLIC_DEFAULT_LANGUAGE=es

# ===========================================
# CONFIGURACIÓN DE NOTIFICACIONES
# ===========================================
# Para notificaciones en español
NEXT_PUBLIC_NOTIFICATION_LANGUAGE=es
NEXT_PUBLIC_NOTIFICATION_TIMEZONE=Europe/Madrid

# ===========================================
# CONFIGURACIÓN DE PRUEBAS
# ===========================================
# Para pruebas en español
NEXT_PUBLIC_TRIAL_DURATION_MINUTES=5
NEXT_PUBLIC_TRIAL_MESSAGE=Prueba gratuita de 5 minutos
NEXT_PUBLIC_TRIAL_LANGUAGE=es

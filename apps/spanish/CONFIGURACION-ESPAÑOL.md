# Configuración para la Versión en Español de talkAI

## Guía de Configuración Específica para el Mercado Español

### 1. Variables de Entorno Específicas

#### Configuración de Idioma
```env
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en
NEXT_PUBLIC_CURRENCY=EUR
NEXT_PUBLIC_TIMEZONE=Europe/Madrid
```

#### Configuración de Emergencias para España
```env
NEXT_PUBLIC_EMERGENCY_PHONE=112
NEXT_PUBLIC_CRISIS_LINE=717003717
NEXT_PUBLIC_CRISIS_LINE_NAME=Línea de Prevención del Suicidio
```

#### Configuración de Contenido en Español
```env
NEXT_PUBLIC_DEFAULT_THERAPIST_NAME=Terapeuta IA
NEXT_PUBLIC_DEFAULT_GREETING=¡Hola! Soy tu terapeuta IA. ¿Cómo estás hoy?
NEXT_PUBLIC_DEFAULT_LANGUAGE=es
```

### 2. Configuración de Stripe para España

#### Precios en Euros
- **Plan Gratuito**: 0€/mes
- **Plan Estándar**: 12.99€/mes (120 minutos)
- **Plan Premium**: 29.99€/mes (300 minutos)

#### Configuración de Stripe
```env
STRIPE_STANDARD_PRICE_ID=price_standard_eur
STRIPE_PREMIUM_PRICE_ID=price_premium_eur
```

### 3. Configuración de Dominio

#### Para Desarrollo
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Para Producción
```env
NEXT_PUBLIC_SITE_URL=https://www.talkai.es
```

### 4. Configuración de Email

#### Emails en Español
```env
EMAIL_FROM_NAME=talkAI
EMAIL_FROM_ADDRESS=noreply@talkai.es
EMAIL_TEMPLATE_LANGUAGE=es
```

### 5. Configuración de Redes Sociales

#### Perfiles en Español
```env
NEXT_PUBLIC_TWITTER_HANDLE=@talkAI_es
NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/talkai.es
NEXT_PUBLIC_LINKEDIN_PAGE=https://linkedin.com/company/talkai-es
```

### 6. Configuración de Cumplimiento Legal

#### GDPR para España
```env
NEXT_PUBLIC_GDPR_COMPLIANCE=true
NEXT_PUBLIC_COOKIE_CONSENT_REQUIRED=true
```

### 7. Configuración de Hume AI para Español

#### Voces en Español
```env
# IMPORTANTE: Necesitarás crear configuraciones separadas en Hume AI
# Ve a https://beta.hume.ai/ y crea nuevas configuraciones EVI con voces en español
# Ver guía completa: CONFIGURACION-VOCES-ESPAÑOL.md

# Voces en Español - Masculinas
NEXT_PUBLIC_HUME_SPANISH_MALE_CONFIG_ID=tu_spanish_male_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_CALM_CONFIG_ID=tu_spanish_male_calm_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_PROFESSIONAL_CONFIG_ID=tu_spanish_male_professional_config_id_aqui

# Voces en Español - Femeninas
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CONFIG_ID=tu_spanish_female_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CALM_CONFIG_ID=tu_spanish_female_calm_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_PROFESSIONAL_CONFIG_ID=tu_spanish_female_professional_config_id_aqui
```

### 8. Configuración de OpenAI para Español

#### Respuestas en Español
```env
OPENAI_DEFAULT_LANGUAGE=es
OPENAI_RESPONSE_STYLE=empathic_spanish
```

### 9. Pasos de Configuración

1. **Copia el archivo de configuración**:
   ```bash
   cp env.example.es .env.local
   ```

2. **Configura las variables de entorno**:
   - Actualiza las URLs de Supabase
   - Configura las claves de Hume AI
   - **Crea configuraciones de voz en español** (ver CONFIGURACION-VOCES-ESPAÑOL.md)
   - Establece las claves de OpenAI
   - Configura Stripe con precios en euros

3. **Configura el dominio**:
   - Para desarrollo: `http://localhost:3000`
   - Para producción: `https://www.talkai.es`

4. **Configura las redes sociales**:
   - Actualiza los enlaces a perfiles en español
   - Configura los handles de Twitter

5. **Configura el email**:
   - Establece el dominio de email en español
   - Configura las plantillas de email

### 9. Verificación de Configuración

#### Checklist de Verificación
- [ ] Variables de idioma configuradas
- [ ] Precios en euros configurados
- [ ] Números de emergencia españoles
- [ ] Dominio configurado correctamente
- [ ] Emails en español configurados
- [ ] Redes sociales en español
- [ ] Cumplimiento GDPR habilitado

### 10. Despliegue

#### Para Vercel
1. Configura las variables de entorno en el dashboard de Vercel
2. Establece el dominio personalizado como `talkai.es`
3. Configura el certificado SSL

#### Para Otros Proveedores
1. Configura las variables de entorno
2. Establece el dominio
3. Configura el certificado SSL

### 11. Monitoreo y Analytics

#### Google Analytics
```env
NEXT_PUBLIC_GA_ID=tu_google_analytics_id_aqui
```

#### Google Tag Manager
```env
NEXT_PUBLIC_GTM_ID=tu_google_tag_manager_id_aqui
```

### 12. Soporte y Contacto

#### Información de Contacto en Español
- **Email**: soporte@talkai.es
- **Teléfono**: +34 XXX XXX XXX
- **Horario**: Lunes a Viernes, 9:00-18:00 CET

### 13. Recursos Adicionales

#### Documentación
- [README en Español](README-ES.md)
- [Guía de Instalación](README.md)
- [Configuración de Voces en Español](CONFIGURACION-VOCES-ESPAÑOL.md)

#### Enlaces Útiles
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Hume AI Console](https://beta.hume.ai/)
- [OpenAI Platform](https://platform.openai.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

**Nota**: Esta configuración está optimizada para el mercado español y cumple con las regulaciones locales de protección de datos (GDPR).

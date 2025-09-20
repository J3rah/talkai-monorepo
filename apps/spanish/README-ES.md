# talkAI - Plataforma de Terapia IA Empática (Versión en Español)

## Descripción

talkAI es una plataforma de terapia IA empática que proporciona apoyo emocional en tiempo real a través de interacciones de voz y texto. La plataforma utiliza tecnología avanzada de detección de emociones para entregar respuestas terapéuticas personalizadas, haciendo el apoyo de salud mental accesible, privado y disponible 24/7.

## Características Principales

### 🎯 Terapia Basada en Voz
- Conversación natural con IA empática
- Análisis de emociones en tiempo real
- Múltiples opciones de voz terapéutica
- Grabación y reproducción de sesiones

### 💬 Chat de Terapia por Texto
- Conversación en tiempo real con terapeuta IA
- Detección de emociones a través de patrones de conversación
- Historial de mensajes y threading de conversaciones
- Capacidades de exportación y compartir

### 🧠 Detección y Análisis de Emociones
- Análisis de tono y patrones de voz
- Análisis de sentimientos de conversación
- Seguimiento del estado emocional a lo largo del tiempo
- Identificación de desencadenantes y reconocimiento de patrones

### 🎨 Respuestas Terapéuticas Personalizadas
- La IA aprende patrones y preferencias del usuario
- El enfoque terapéutico se adapta al estado emocional
- Selección de técnicas basadas en evidencia (TCC, mindfulness, etc.)
- Detección de crisis y escalación apropiada

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, Radix UI
- **IA y Voz**: Hume AI, OpenAI
- **Base de Datos**: Supabase
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe
- **Despliegue**: Vercel

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/empathic-voice-espanol.git
cd empathic-voice-espanol
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Hume AI
HUME_API_KEY=tu_hume_api_key

# OpenAI
OPENAI_API_KEY=tu_openai_api_key

# Stripe
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret

# Otros
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

4. **Configurar la base de datos**
```bash
# Ejecutar migraciones de Supabase
npx supabase db reset
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

## Estructura del Proyecto

```
empathic-voice-espanol/
├── app/                    # Páginas de Next.js
│   ├── about/             # Página Acerca de
│   ├── auth/              # Autenticación
│   ├── chat/              # Chat de terapia
│   ├── dashboard/         # Panel de usuario
│   ├── faq/               # Preguntas frecuentes
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── LandingPage.tsx   # Página de inicio
│   ├── StartCall.tsx     # Iniciar llamada
│   └── ...
├── lib/                  # Utilidades y configuraciones
├── hooks/                # Hooks personalizados
├── types/                # Definiciones de TypeScript
└── utils/                # Funciones utilitarias
```

## Características de la Versión en Español

### 🌍 Localización Completa
- Interfaz de usuario completamente en español
- Metadatos SEO optimizados para audiencia hispanohablante
- Configuración de idioma en `es-ES`
- Estructura de datos JSON-LD en español

### 🎯 Adaptación Cultural
- Contenido adaptado para audiencia hispanohablante
- Referencias culturales apropiadas
- Terminología de salud mental en español
- Recursos de emergencia localizados

### 📱 Funcionalidades Mantenidas
- Todas las características técnicas del original
- Integración completa con Hume AI
- Sistema de suscripciones y pagos
- Análisis de emociones en tiempo real
- Panel de administración

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Ejecutar linter

# Testing
npm test             # Ejecutar tests
npm run test:watch   # Ejecutar tests en modo watch

# Base de datos
npm run db:reset     # Resetear base de datos
npm run db:seed      # Poblar base de datos con datos de prueba
```

## Configuración de Producción

### Variables de Entorno Requeridas

```env
# Producción
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

# Supabase (Producción)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_prod_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_prod_service_key

# Hume AI
HUME_API_KEY=tu_hume_prod_api_key

# OpenAI
OPENAI_API_KEY=tu_openai_prod_api_key

# Stripe (Producción)
STRIPE_PUBLISHABLE_KEY=tu_stripe_prod_publishable_key
STRIPE_SECRET_KEY=tu_stripe_prod_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_prod_webhook_secret
```

### Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente en cada push a main

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Soporte

Para soporte técnico o preguntas sobre la versión en español:

- 📧 Email: soporte@talkai.es
- 💬 Discord: [Servidor de talkAI](https://discord.gg/talkai)
- 📖 Documentación: [docs.talkai.es](https://docs.talkai.es)

## Agradecimientos

- Equipo original de talkAI por la base del proyecto
- Comunidad hispanohablante por el feedback y sugerencias
- Contribuidores de código abierto que hacen posible este proyecto

---

**Nota**: Esta es una versión localizada en español del proyecto talkAI original. Mantiene toda la funcionalidad técnica mientras adapta la experiencia de usuario para audiencias hispanohablantes.

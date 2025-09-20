# talkAI - Plataforma de Terapia IA Empática

<div align="center">
  <h1>🧠💝 La IA Empática - Terapia de Voz en Español</h1>
  <p>Plataforma de terapia IA que entiende tus emociones en tiempo real</p>
</div>

![preview.png](preview.png)

## Descripción General

Este proyecto es una implementación completa de la [Interfaz de Voz Empática de Hume](https://hume.docs.buildwithfern.com/docs/empathic-voice-interface-evi/overview) adaptada para audiencias hispanohablantes. talkAI proporciona terapia IA empática a través de conversaciones de voz y texto, con análisis de emociones en tiempo real.

## Características Principales

### 🎯 Terapia de Voz Empática
- Conversaciones naturales con IA que entiende emociones
- Análisis de emociones en tiempo real usando Hume AI
- Múltiples voces terapéuticas personalizables
- Respuestas adaptadas al estado emocional del usuario

### 💬 Chat de Terapia por Texto
- Conversaciones de texto con IA empática
- Detección de emociones a través de patrones de lenguaje
- Historial de conversaciones y análisis de progreso
- Exportación de datos de sesiones

### 🧠 Análisis Avanzado de Emociones
- Detección de 57+ emociones diferentes
- Análisis de prosodia y patrones de voz
- Seguimiento de tendencias emocionales
- Métricas de bienestar personalizadas

### 🔒 Privacidad y Seguridad
- Conversaciones encriptadas y seguras
- Control total sobre datos personales
- Cumplimiento con estándares de privacidad
- Opción de sesiones sin almacenamiento

## Despliegue del Proyecto

Haz clic en el botón de abajo para desplegar este proyecto de ejemplo con Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftu-usuario%2Fempathic-voice-espanol&env=HUME_API_KEY,HUME_SECRET_KEY,SUPABASE_URL,SUPABASE_ANON_KEY,OPENAI_API_KEY)

### Pasos para completar el despliegue:

1. **Crear un Repositorio Git** para tu proyecto
2. **Proporcionar las variables de entorno requeridas**:
   - `HUME_API_KEY` - Obtén tu clave API en el [portal de Hume](https://beta.hume.ai/settings/keys)
   - `HUME_SECRET_KEY` - Clave secreta de Hume
   - `SUPABASE_URL` - URL de tu proyecto Supabase
   - `SUPABASE_ANON_KEY` - Clave anónima de Supabase
   - `OPENAI_API_KEY` - Clave API de OpenAI
   - `STRIPE_PUBLISHABLE_KEY` - Clave pública de Stripe
   - `STRIPE_SECRET_KEY` - Clave secreta de Stripe

## Instalación Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Hume AI
- Proyecto de Supabase
- Cuenta de OpenAI
- Cuenta de Stripe (para pagos)

### Pasos de Instalación

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
# Hume AI
HUME_API_KEY=tu_hume_api_key
HUME_SECRET_KEY=tu_hume_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI
OPENAI_API_KEY=tu_openai_api_key

# Stripe
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret

# Otros
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
├── app/                    # Páginas de Next.js App Router
│   ├── about/             # Página Acerca de
│   ├── auth/              # Autenticación
│   ├── chat/              # Chat de terapia
│   ├── dashboard/         # Panel de usuario
│   ├── faq/               # Preguntas frecuentes
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── LandingPage.tsx   # Página de inicio
│   ├── StartCall.tsx     # Iniciar llamada de voz
│   ├── Messages.tsx      # Componente de mensajes
│   └── ...
├── lib/                  # Utilidades y configuraciones
├── hooks/                # Hooks personalizados
├── types/                # Definiciones de TypeScript
└── utils/                # Funciones utilitarias
```

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, Radix UI
- **IA y Voz**: Hume AI, OpenAI
- **Base de Datos**: Supabase
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe
- **Despliegue**: Vercel

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
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Soporte

Si tienes preguntas, necesitas asistencia o deseas participar en discusiones relacionadas con esta plantilla:

- 💬 [Únete a nuestro Discord](https://link.hume.ai/discord)
- 📧 Email: soporte@talkai.es
- 📖 Documentación: [docs.talkai.es](https://docs.talkai.es)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Nota**: Esta es una versión localizada en español del proyecto talkAI original. Mantiene toda la funcionalidad técnica mientras adapta la experiencia de usuario para audiencias hispanohablantes.
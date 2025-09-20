# Configuración de Voces en Español para Hume AI EVI

## 🎯 Guía Completa para Configurar Voces en Español

### 1. Crear Configuraciones de Voz en Hume AI

#### Paso 1: Acceder a Hume AI Platform
1. Ve a [Hume AI Platform](https://beta.hume.ai/)
2. Inicia sesión en tu cuenta
3. Navega a **"EVI Configurations"**

#### Paso 2: Crear Nueva Configuración
1. Haz clic en **"Create New Configuration"**
2. Selecciona **"EVI 3"** como modelo
3. Configura los siguientes parámetros:

### 2. Configuraciones Recomendadas para Voces en Español

#### 🧑‍💼 Voz Masculina Profesional
```json
{
  "name": "Terapeuta Masculino - Profesional",
  "description": "Voz masculina profesional para terapia en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_male_professional"
  },
  "language": "es",
  "system_prompt": "Eres un terapeuta profesional empático que habla español. Proporcionas apoyo emocional y guía terapéutica de manera cálida y profesional.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 👩‍⚕️ Voz Femenina Profesional
```json
{
  "name": "Terapeuta Femenina - Profesional",
  "description": "Voz femenina profesional para terapia en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_female_professional"
  },
  "language": "es",
  "system_prompt": "Eres una terapeuta profesional empática que habla español. Proporcionas apoyo emocional y guía terapéutica de manera cálida y profesional.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 🧘‍♂️ Voz Masculina Calma
```json
{
  "name": "Terapeuta Masculino - Calma",
  "description": "Voz masculina calmada para relajación en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_male_calm"
  },
  "language": "es",
  "system_prompt": "Eres un terapeuta calmado y relajante que habla español. Ayudas a las personas a encontrar paz y tranquilidad a través de técnicas de relajación y mindfulness.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 🧘‍♀️ Voz Femenina Calma
```json
{
  "name": "Terapeuta Femenina - Calma",
  "description": "Voz femenina calmada para relajación en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_female_calm"
  },
  "language": "es",
  "system_prompt": "Eres una terapeuta calmada y relajante que habla español. Ayudas a las personas a encontrar paz y tranquilidad a través de técnicas de relajación y mindfulness.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 😊 Voz Masculina Amigable
```json
{
  "name": "Terapeuta Masculino - Amigable",
  "description": "Voz masculina amigable y accesible en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_male_friendly"
  },
  "language": "es",
  "system_prompt": "Eres un terapeuta amigable y accesible que habla español. Te comunicas de manera cercana y cálida, haciendo que las personas se sientan cómodas y escuchadas.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 😊 Voz Femenina Amigable
```json
{
  "name": "Terapeuta Femenina - Amigable",
  "description": "Voz femenina amigable y accesible en español",
  "voice": {
    "provider": "hume",
    "name": "spanish_female_friendly"
  },
  "language": "es",
  "system_prompt": "Eres una terapeuta amigable y accesible que habla español. Te comunicas de manera cercana y cálida, haciendo que las personas se sientan cómodas y escuchadas.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

### 3. Obtener los Config IDs

#### Después de crear cada configuración:
1. **Guarda la configuración** en Hume AI Platform
2. **Copia el Config ID** que se genera
3. **Actualiza tu archivo `.env.local`** con los IDs correspondientes

### 4. Actualizar Variables de Entorno

#### En tu archivo `.env.local`:
```env
# Voces en Español - Masculinas
NEXT_PUBLIC_HUME_SPANISH_MALE_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_CALM_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_PROFESSIONAL_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_MALE_FRIENDLY_CONFIG_ID=tu_config_id_aqui

# Voces en Español - Femeninas
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_CALM_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_PROFESSIONAL_CONFIG_ID=tu_config_id_aqui
NEXT_PUBLIC_HUME_SPANISH_FEMALE_FRIENDLY_CONFIG_ID=tu_config_id_aqui
```

### 5. Actualizar el Código de la Aplicación

#### En `components/TrialStartCall.tsx`:
```typescript
const trialVoiceConfigs = [
  {
    id: 'spanish-male',
    name: 'Voz Masculina',
    description: 'Terapeuta masculino profesional y empático',
    configId: process.env.NEXT_PUBLIC_HUME_SPANISH_MALE_CONFIG_ID,
    gender: 'male' as const,
    language: 'es'
  },
  {
    id: 'spanish-female',
    name: 'Voz Femenina',
    description: 'Terapeuta femenina profesional y empática',
    configId: process.env.NEXT_PUBLIC_HUME_SPANISH_FEMALE_CONFIG_ID,
    gender: 'female' as const,
    language: 'es'
  },
  {
    id: 'spanish-male-calm',
    name: 'Voz Masculina Calma',
    description: 'Terapeuta masculino calmado para relajación',
    configId: process.env.NEXT_PUBLIC_HUME_SPANISH_MALE_CALM_CONFIG_ID,
    gender: 'male' as const,
    language: 'es'
  },
  {
    id: 'spanish-female-calm',
    name: 'Voz Femenina Calma',
    description: 'Terapeuta femenina calmada para relajación',
    configId: process.env.NEXT_PUBLIC_HUME_SPANISH_FEMALE_CALM_CONFIG_ID,
    gender: 'female' as const,
    language: 'es'
  }
];
```

### 6. Testing y Validación

#### Checklist de Pruebas:
- [ ] Crear todas las configuraciones en Hume AI
- [ ] Obtener todos los Config IDs
- [ ] Actualizar variables de entorno
- [ ] Probar cada voz en la aplicación
- [ ] Verificar que las respuestas son en español
- [ ] Confirmar detección de emociones en español
- [ ] Probar diferentes acentos y entonaciones

### 7. Consideraciones Culturales

#### Adaptaciones para Audiencia Española:
- **Formalidad**: Usar "usted" para mayor formalidad
- **Expresiones**: Incluir expresiones comunes en español
- **Cultura**: Referencias culturales apropiadas
- **Acentos**: Considerar acentos regionales si es necesario

### 8. Recursos Adicionales

#### Enlaces Útiles:
- [Hume AI Platform](https://beta.hume.ai/)
- [EVI Configuration Documentation](https://dev.hume.ai/docs/empathic-voice-interface-evi/configuration)
- [Spanish Language Support](https://dev.hume.ai/docs/empathic-voice-interface-evi/languages)

#### Soporte:
- **Email**: soporte@talkai.es
- **Documentación**: [docs.talkai.es](https://docs.talkai.es)

---

**Nota**: Esta configuración te permitirá ofrecer una experiencia completamente localizada en español con voces nativas optimizadas para terapia y apoyo emocional.

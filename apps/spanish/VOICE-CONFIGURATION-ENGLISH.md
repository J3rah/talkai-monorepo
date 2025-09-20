# English Voice Configuration for Hume AI EVI

## 🎯 Complete Guide for Configuring English Voices

### 1. Creating Voice Configurations in Hume AI

#### Step 1: Access Hume AI Platform
1. Go to [Hume AI Platform](https://beta.hume.ai/)
2. Sign in to your account
3. Navigate to **"EVI Configurations"**

#### Step 2: Create New Configuration
1. Click **"Create New Configuration"**
2. Select **"EVI 3"** as the model
3. Configure the following parameters:

### 2. Recommended Configurations for English Voices

#### 🧑‍💼 Professional Male Voice
```json
{
  "name": "Professional Male Therapist",
  "description": "Professional male voice for therapy in English",
  "voice": {
    "provider": "hume",
    "name": "english_male_professional"
  },
  "language": "en",
  "system_prompt": "You are an empathetic professional therapist who speaks English. You provide emotional support and therapeutic guidance in a warm and professional manner.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 👩‍⚕️ Professional Female Voice
```json
{
  "name": "Professional Female Therapist",
  "description": "Professional female voice for therapy in English",
  "voice": {
    "provider": "hume",
    "name": "english_female_professional"
  },
  "language": "en",
  "system_prompt": "You are an empathetic professional therapist who speaks English. You provide emotional support and therapeutic guidance in a warm and professional manner.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 🧘‍♂️ Calm Male Voice
```json
{
  "name": "Calm Male Therapist",
  "description": "Calm male voice for relaxation in English",
  "voice": {
    "provider": "hume",
    "name": "english_male_calm"
  },
  "language": "en",
  "system_prompt": "You are a calm and relaxing therapist who speaks English. You help people find peace and tranquility through relaxation techniques and mindfulness.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 🧘‍♀️ Calm Female Voice
```json
{
  "name": "Calm Female Therapist",
  "description": "Calm female voice for relaxation in English",
  "voice": {
    "provider": "hume",
    "name": "english_female_calm"
  },
  "language": "en",
  "system_prompt": "You are a calm and relaxing therapist who speaks English. You help people find peace and tranquility through relaxation techniques and mindfulness.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 😊 Friendly Male Voice
```json
{
  "name": "Friendly Male Therapist",
  "description": "Friendly and approachable male voice in English",
  "voice": {
    "provider": "hume",
    "name": "english_male_friendly"
  },
  "language": "en",
  "system_prompt": "You are a friendly and approachable therapist who speaks English. You communicate in a warm and close manner, making people feel comfortable and heard.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

#### 😊 Friendly Female Voice
```json
{
  "name": "Friendly Female Therapist",
  "description": "Friendly and approachable female voice in English",
  "voice": {
    "provider": "hume",
    "name": "english_female_friendly"
  },
  "language": "en",
  "system_prompt": "You are a friendly and approachable therapist who speaks English. You communicate in a warm and close manner, making people feel comfortable and heard.",
  "emotion_analysis": true,
  "prosody_analysis": true
}
```

### 3. Getting the Config IDs

#### After creating each configuration:
1. **Save the configuration** in Hume AI Platform
2. **Copy the Config ID** that is generated
3. **Update your `.env.local` file** with the corresponding IDs

### 4. Update Environment Variables

#### In your `.env.local` file:
```env
# English Voices - Male
NEXT_PUBLIC_HUME_ENGLISH_MALE_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_MALE_CALM_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_MALE_PROFESSIONAL_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_MALE_FRIENDLY_CONFIG_ID=your_config_id_here

# English Voices - Female
NEXT_PUBLIC_HUME_ENGLISH_FEMALE_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_FEMALE_CALM_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_FEMALE_PROFESSIONAL_CONFIG_ID=your_config_id_here
NEXT_PUBLIC_HUME_ENGLISH_FEMALE_FRIENDLY_CONFIG_ID=your_config_id_here
```

### 5. Update Application Code

#### In `components/TrialStartCall.tsx`:
```typescript
const trialVoiceConfigs = [
  {
    id: 'english-male',
    name: 'Male Voice',
    description: 'Professional and empathetic male therapist',
    configId: process.env.NEXT_PUBLIC_HUME_ENGLISH_MALE_CONFIG_ID,
    gender: 'male' as const,
    language: 'en'
  },
  {
    id: 'english-female',
    name: 'Female Voice',
    description: 'Professional and empathetic female therapist',
    configId: process.env.NEXT_PUBLIC_HUME_ENGLISH_FEMALE_CONFIG_ID,
    gender: 'female' as const,
    language: 'en'
  },
  {
    id: 'english-male-calm',
    name: 'Calm Male Voice',
    description: 'Calm male therapist for relaxation',
    configId: process.env.NEXT_PUBLIC_HUME_ENGLISH_MALE_CALM_CONFIG_ID,
    gender: 'male' as const,
    language: 'en'
  },
  {
    id: 'english-female-calm',
    name: 'Calm Female Voice',
    description: 'Calm female therapist for relaxation',
    configId: process.env.NEXT_PUBLIC_HUME_ENGLISH_FEMALE_CALM_CONFIG_ID,
    gender: 'female' as const,
    language: 'en'
  }
];
```

### 6. Testing and Validation

#### Testing Checklist:
- [ ] Create all configurations in Hume AI
- [ ] Get all Config IDs
- [ ] Update environment variables
- [ ] Test each voice in the application
- [ ] Verify responses are in English
- [ ] Confirm emotion detection in English
- [ ] Test different accents and intonations

### 7. Cultural Considerations

#### Adaptations for English-Speaking Audience:
- **Formality**: Use appropriate formality levels for different contexts
- **Expressions**: Include common English expressions and idioms
- **Culture**: Appropriate cultural references for English speakers
- **Accents**: Consider regional accents if needed

### 8. Additional Resources

#### Useful Links:
- [Hume AI Platform](https://beta.hume.ai/)
- [EVI Configuration Documentation](https://dev.hume.ai/docs/empathic-voice-interface-evi/configuration)
- [English Language Support](https://dev.hume.ai/docs/empathic-voice-interface-evi/languages)

#### Support:
- **Email**: support@talkai.com
- **Documentation**: [docs.talkai.com](https://docs.talkai.com)

---

**Note**: This configuration will allow you to offer a completely localized English experience with native voices optimized for therapy and emotional support.

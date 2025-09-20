-- Add TTS config column to distinguish from EVI config
ALTER TABLE voice_configurations
ADD COLUMN IF NOT EXISTS tts_config_id TEXT;

-- Back-fill with current EVI IDs so behaviour stays identical until we update rows
UPDATE voice_configurations
SET tts_config_id = hume_config_id
WHERE tts_config_id IS NULL;

-- Add simple index for look-ups
CREATE INDEX IF NOT EXISTS idx_voice_configurations_tts_id ON voice_configurations(tts_config_id);

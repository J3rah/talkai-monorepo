-- Create voice configuration groups table
CREATE TABLE IF NOT EXISTS voice_configuration_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create voice configurations table
CREATE TABLE IF NOT EXISTS voice_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  internal_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  hume_config_id TEXT NOT NULL,
  base_voice TEXT DEFAULT 'ITO',
  parameters JSONB DEFAULT '{"speaking_rate": 1.0, "pitch": 0.0}'::jsonb,
  required_plan TEXT DEFAULT 'calm' CHECK (required_plan IN ('calm', 'centered', 'grounded')),
  group_id UUID REFERENCES voice_configuration_groups(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voice_configurations_group_id ON voice_configurations(group_id);
CREATE INDEX IF NOT EXISTS idx_voice_configurations_required_plan ON voice_configurations(required_plan);
CREATE INDEX IF NOT EXISTS idx_voice_configurations_is_active ON voice_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_voice_configuration_groups_is_active ON voice_configuration_groups(is_active);

-- Enable RLS
ALTER TABLE voice_configuration_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow read access to all authenticated users
CREATE POLICY "Allow read access to voice configuration groups" ON voice_configuration_groups FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Allow read access to voice configurations" ON voice_configurations FOR SELECT TO authenticated USING (is_active = true);

-- Insert voice configuration groups
INSERT INTO voice_configuration_groups (name, display_name, description, sort_order) VALUES
('classic', 'Classic Voices', 'Traditional, professional therapy voices for everyday sessions', 1),
('creative', 'Character Voices', 'Unique, engaging voices with personality for a more dynamic experience', 2);

-- Insert voice configurations
WITH groups AS (
  SELECT id, name FROM voice_configuration_groups
)
INSERT INTO voice_configurations (internal_name, display_name, description, hume_config_id, parameters, required_plan, group_id, sort_order) 
SELECT 
  config.internal_name,
  config.display_name,
  config.description,
  config.hume_config_id,
  config.parameters::jsonb,
  config.required_plan,
  groups.id,
  config.sort_order
FROM (
  VALUES 
    -- Classic Voices Group
    ('male', 'Male Voice', 'A male therapeutic voice', '793d1f15-4bf9-4beb-a4ab-a62caff84e70', '{"speaking_rate": 1.0, "pitch": 0.0}', 'calm', 'classic', 1),
    ('female', 'Female Voice', 'A female therapeutic voice', '3a451da2-a50a-42c2-83fa-13c79f027643', '{"speaking_rate": 1.0, "pitch": 0.0}', 'calm', 'classic', 2),
    ('calm', 'Calm Voice', 'A softer, more soothing voice', '8a80af40-ec14-4da0-afeb-d11008491410', '{"speaking_rate": 0.9, "pitch": -0.2}', 'centered', 'classic', 3),
    ('energetic', 'Energetic Voice', 'A more dynamic and engaging voice', '8a80af40-ec14-4da0-afeb-d11008491410', '{"speaking_rate": 1.1, "pitch": 0.2}', 'centered', 'classic', 4),
    ('professional', 'Professional Voice', 'A clear and authoritative voice', '3a451da2-a50a-42c2-83fa-13c79f027643', '{"speaking_rate": 1.0, "pitch": 0.0}', 'grounded', 'classic', 5),
    ('friendly', 'Friendly Voice', 'A warm and approachable voice', '3a451da2-a50a-42c2-83fa-13c79f027643', '{"speaking_rate": 1.0, "pitch": 0.1}', 'grounded', 'classic', 6),
    -- Character Voices Group  
    ('sass', 'Sass', 'A friendly, down-to-earth voice with western charm', '8346ae7f-32c4-40f6-aa81-20ce7081df13', '{"speaking_rate": 0.95, "pitch": -0.1}', 'grounded', 'creative', 1),
    ('jacksparrow', 'The Pirate', 'A charismatic and witty voice inspired by legendary pirates', 'a608626e-23e0-4070-8e24-dc880d34000b', '{"speaking_rate": 0.95, "pitch": 0.1}', 'grounded', 'creative', 2)
) AS config(internal_name, display_name, description, hume_config_id, parameters, required_plan, group_name, sort_order)
JOIN groups ON groups.name = config.group_name;

-- Add update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voice_configuration_groups_updated_at BEFORE UPDATE ON voice_configuration_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_configurations_updated_at BEFORE UPDATE ON voice_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
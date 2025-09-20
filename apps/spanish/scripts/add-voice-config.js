#!/usr/bin/env node

/**
 * Script to add new voice configurations to the database
 * Usage: node scripts/add-voice-config.js --name "Voice Name" --id "hume-config-id" --group "classic|creative" --plan "calm|centered|grounded"
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addVoiceConfiguration() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const getName = () => args[args.indexOf('--name') + 1];
  const getId = () => args[args.indexOf('--id') + 1];
  const getGroup = () => args[args.indexOf('--group') + 1];
  const getPlan = () => args[args.indexOf('--plan') + 1];
  const getDescription = () => args[args.indexOf('--description') + 1] || '';
  const getInternalName = () => {
    const internalIndex = args.indexOf('--internal');
    if (internalIndex !== -1 && internalIndex + 1 < args.length) {
      return args[internalIndex + 1];
    }
    return getName()?.toLowerCase().replace(/\s+/g, '');
  };

  if (!getName() || !getId() || !getGroup() || !getPlan()) {
    console.log(`
Usage: node scripts/add-voice-config.js --name "Voice Name" --id "hume-config-id" --group "classic|creative" --plan "calm|centered|grounded"

Options:
  --name        Display name for the voice (required)
  --id          Hume configuration ID (required)
  --group       Voice group: "classic" or "creative" (required)
  --plan        Required plan: "calm", "centered", or "grounded" (required)
  --description Description of the voice (optional)
  --internal    Internal name (optional, defaults to lowercase name)

Examples:
  node scripts/add-voice-config.js --name "Einstein" --id "abc123" --group "creative" --plan "grounded" --description "A wise, scientific voice"
  node scripts/add-voice-config.js --name "Calm Female" --id "def456" --group "classic" --plan "centered"
`);
    process.exit(1);
  }

  const name = getName();
  const configId = getId();
  const groupName = getGroup();
  const plan = getPlan();
  const description = getDescription();
  const internalName = getInternalName();

  // Validate inputs
  if (!['classic', 'creative'].includes(groupName)) {
    console.error('Error: Group must be either "classic" or "creative"');
    process.exit(1);
  }

  if (!['calm', 'centered', 'grounded'].includes(plan)) {
    console.error('Error: Plan must be "calm", "centered", or "grounded"');
    process.exit(1);
  }

  try {
    console.log(`Adding voice configuration: ${name}`);
    console.log(`- Hume Config ID: ${configId}`);
    console.log(`- Group: ${groupName}`);
    console.log(`- Required Plan: ${plan}`);
    console.log(`- Description: ${description || 'None'}`);
    console.log(`- Internal Name: ${internalName}`);

    // Get the group ID
    const { data: group, error: groupError } = await supabase
      .from('voice_configuration_groups')
      .select('id')
      .eq('name', groupName)
      .single();

    if (groupError || !group) {
      console.error('Error: Could not find voice group:', groupName);
      process.exit(1);
    }

    // Get the next sort order for this group
    const { data: existing, error: existingError } = await supabase
      .from('voice_configurations')
      .select('sort_order')
      .eq('group_id', group.id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (existingError) {
      console.error('Error fetching existing configurations:', existingError);
      process.exit(1);
    }

    const nextSortOrder = existing?.length > 0 ? existing[0].sort_order + 1 : 1;

    // Insert the new voice configuration
    const { data, error } = await supabase
      .from('voice_configurations')
      .insert({
        internal_name: internalName,
        display_name: name,
        description: description || `A ${plan} voice configuration`,
        hume_config_id: configId,
        base_voice: 'ITO',
        parameters: { speaking_rate: 1.0, pitch: 0.0 },
        required_plan: plan,
        group_id: group.id,
        sort_order: nextSortOrder,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding voice configuration:', error);
      process.exit(1);
    }

    console.log('\n✅ Voice configuration added successfully!');
    console.log('Configuration details:', {
      id: data.id,
      internal_name: data.internal_name,
      display_name: data.display_name,
      hume_config_id: data.hume_config_id,
      required_plan: data.required_plan,
      group_id: data.group_id,
      sort_order: data.sort_order
    });

    console.log('\n🎉 The voice is now available in the UI for users with the required subscription plan!');

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

addVoiceConfiguration(); 
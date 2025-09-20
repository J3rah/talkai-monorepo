#!/usr/bin/env node

/**
 * Script to update existing voice configurations in the database
 * Usage: node scripts/update-voice.js --id "internal-name" [options]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateVoiceConfiguration() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const getId = () => {
    const index = args.indexOf('--id');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getName = () => {
    const index = args.indexOf('--name');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getDisplayName = () => {
    const index = args.indexOf('--display-name');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getDescription = () => {
    const index = args.indexOf('--description');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getHumeId = () => {
    const index = args.indexOf('--hume-id');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getGroup = () => {
    const index = args.indexOf('--group');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getPlan = () => {
    const index = args.indexOf('--plan');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getSpeakingRate = () => {
    const index = args.indexOf('--speaking-rate');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getPitch = () => {
    const index = args.indexOf('--pitch');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getBaseVoice = () => {
    const index = args.indexOf('--base-voice');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getActive = () => {
    const index = args.indexOf('--active');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getSortOrder = () => {
    const index = args.indexOf('--sort-order');
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  };
  const getHelp = () => args.includes('--help') || args.includes('-h');

  if (getHelp() || !getId()) {
    console.log(`
Usage: node scripts/update-voice.js --id "internal-name" [options]

Required:
  --id              Internal name of the voice to update (required)

Options:
  --name            New internal name (use with caution)
  --display-name    New display name
  --description     New description
  --hume-id         New Hume configuration ID
  --group           New voice group: "classic" or "creative"
  --plan            New required plan: "calm", "centered", or "grounded"
  --speaking-rate   New speaking rate (e.g., 0.9, 1.0, 1.1)
  --pitch           New pitch (e.g., -0.2, 0.0, 0.2)
  --base-voice      New base voice (e.g., "ITO")
  --active          Set active status: "true" or "false"
  --sort-order      New sort order (integer)
  --help, -h        Show this help message

Examples:
  node scripts/update-voice.js --id "einstein" --description "Updated description"
  node scripts/update-voice.js --id "einstein" --plan "centered"
  node scripts/update-voice.js --id "einstein" --speaking-rate "0.95" --pitch "0.1"
  node scripts/update-voice.js --id "einstein" --active "false"
`);
    process.exit(getId() ? 0 : 1);
  }

  const voiceId = getId();
  const updates = {};

  // Collect all the updates
  if (getName()) {
    updates.internal_name = getName();
    if (!getDisplayName()) {
      updates.display_name = getName();
    }
  }
  if (getDisplayName()) updates.display_name = getDisplayName();
  if (getDescription()) updates.description = getDescription();
  if (getHumeId()) updates.hume_config_id = getHumeId();
  if (getBaseVoice()) updates.base_voice = getBaseVoice();
  if (getActive()) updates.is_active = getActive() === 'true';
  if (getSortOrder()) updates.sort_order = parseInt(getSortOrder());
  if (getPlan()) updates.required_plan = getPlan();

  // Handle voice parameters
  const speakingRate = getSpeakingRate();
  const pitch = getPitch();
  if (speakingRate || pitch) {
    // First get current parameters
    console.log(`Executing query to find voice configuration with internal name: ${voiceId}`);

    const { data: currentVoice, error: fetchError } = await supabase
      .from('voice_configurations')
      .select('parameters')
      .eq('internal_name', voiceId)
      .single();

    if (fetchError) {
      console.error('Error fetching voice configuration:', fetchError);
      process.exit(1);
    }

    console.log('Current voice configuration data:', currentVoice);

    const currentParams = currentVoice?.parameters || { speaking_rate: 1.0, pitch: 0.0 };
    updates.parameters = {
      speaking_rate: speakingRate ? parseFloat(speakingRate) : currentParams.speaking_rate,
      pitch: pitch ? parseFloat(pitch) : currentParams.pitch
    };
  }

  // Validate inputs
  if (getGroup() && !['classic', 'creative'].includes(getGroup())) {
    console.error('Error: Group must be either "classic" or "creative"');
    process.exit(1);
  }

  if (getPlan() && !['calm', 'centered', 'grounded'].includes(getPlan())) {
    console.error('Error: Plan must be "calm", "centered", or "grounded"');
    process.exit(1);
  }

  if (getActive() && !['true', 'false'].includes(getActive())) {
    console.error('Error: Active must be "true" or "false"');
    process.exit(1);
  }

  if (getSpeakingRate() && (isNaN(parseFloat(getSpeakingRate())) || parseFloat(getSpeakingRate()) < 0.5 || parseFloat(getSpeakingRate()) > 2.0)) {
    console.error('Error: Speaking rate must be a number between 0.5 and 2.0');
    process.exit(1);
  }

  if (getPitch() && (isNaN(parseFloat(getPitch())) || parseFloat(getPitch()) < -1.0 || parseFloat(getPitch()) > 1.0)) {
    console.error('Error: Pitch must be a number between -1.0 and 1.0');
    process.exit(1);
  }

  if (Object.keys(updates).length === 0) {
    console.error('Error: No updates specified. Use --help to see available options.');
    process.exit(1);
  }

  try {
    console.log(`🔧 Updating voice configuration: ${voiceId}`);
    console.log('Updates to apply:', JSON.stringify(updates, null, 2));

    // Check if voice exists
    const { data: existingVoice, error: fetchError } = await supabase
      .from('voice_configurations')
      .select('*')
      .eq('internal_name', voiceId)
      .single();

    if (fetchError || !existingVoice) {
      console.error(`Error: Voice configuration "${voiceId}" not found.`);
      console.log('\nTip: Use "node scripts/list-voices.js" to see available voices.');
      process.exit(1);
    }

    // Handle group change if specified
    if (getGroup()) {
      const { data: group, error: groupError } = await supabase
        .from('voice_configuration_groups')
        .select('id')
        .eq('name', getGroup())
        .single();

      if (groupError || !group) {
        console.error(`Error: Could not find voice group: ${getGroup()}`);
        process.exit(1);
      }

      updates.group_id = group.id;
    }

    // Apply the updates
    const { data, error } = await supabase
      .from('voice_configurations')
      .update(updates)
      .eq('internal_name', voiceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating voice configuration:', error);
      process.exit(1);
    }

    console.log('\n✅ Voice configuration updated successfully!');
    
    // Show before and after
    console.log('\n📋 Updated configuration:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Internal Name: ${data.internal_name}`);
    console.log(`   Display Name: ${data.display_name}`);
    console.log(`   Description: ${data.description}`);
    console.log(`   Hume Config ID: ${data.hume_config_id}`);
    console.log(`   Required Plan: ${data.required_plan}`);
    console.log(`   Base Voice: ${data.base_voice}`);
    console.log(`   Parameters: Speaking Rate ${data.parameters?.speaking_rate}, Pitch ${data.parameters?.pitch}`);
    console.log(`   Sort Order: ${data.sort_order}`);
    console.log(`   Active: ${data.is_active}`);
    console.log(`   Updated: ${new Date(data.updated_at).toLocaleString()}`);

    console.log('\n🎉 The voice configuration has been updated!');

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

updateVoiceConfiguration(); 
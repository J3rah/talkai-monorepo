#!/usr/bin/env node

/**
 * Script to list voice configurations from the database
 * Usage: node scripts/list-voices.js [--group classic|creative] [--plan calm|centered|grounded] [--active true|false]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listVoiceConfigurations() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const getGroup = () => args[args.indexOf('--group') + 1];
  const getPlan = () => args[args.indexOf('--plan') + 1];
  const getActive = () => args[args.indexOf('--active') + 1];
  const getHelp = () => args.includes('--help') || args.includes('-h');

  if (getHelp()) {
    console.log(`
Usage: node scripts/list-voices.js [options]

Options:
  --group       Filter by voice group: "classic" or "creative"
  --plan        Filter by required plan: "calm", "centered", or "grounded"
  --active      Filter by active status: "true" or "false"
  --help, -h    Show this help message

Examples:
  node scripts/list-voices.js                    # List all voices
  node scripts/list-voices.js --group classic   # List only classic voices
  node scripts/list-voices.js --plan grounded   # List only grounded plan voices
  node scripts/list-voices.js --active false    # List inactive voices
`);
    process.exit(0);
  }

  const groupFilter = getGroup();
  const planFilter = getPlan();
  const activeFilter = getActive();

  // Validate inputs
  if (groupFilter && !['classic', 'creative'].includes(groupFilter)) {
    console.error('Error: Group must be either "classic" or "creative"');
    process.exit(1);
  }

  if (planFilter && !['calm', 'centered', 'grounded'].includes(planFilter)) {
    console.error('Error: Plan must be "calm", "centered", or "grounded"');
    process.exit(1);
  }

  if (activeFilter && !['true', 'false'].includes(activeFilter)) {
    console.error('Error: Active must be "true" or "false"');
    process.exit(1);
  }

  try {
    console.log('🎵 Fetching voice configurations...\n');

    // Build query with joins to get group information
    let query = supabase
      .from('voice_configurations')
      .select(`
        *,
        voice_configuration_groups!voice_configurations_group_id_fkey (
          name,
          display_name,
          description
        )
      `)
      .order('group_id')
      .order('sort_order');

    // Apply filters
    if (activeFilter !== undefined) {
      query = query.eq('is_active', activeFilter === 'true');
    }

    if (planFilter) {
      query = query.eq('required_plan', planFilter);
    }

    const { data: voices, error } = await query;

    if (error) {
      console.error('Error fetching voice configurations:', error);
      process.exit(1);
    }

    if (!voices || voices.length === 0) {
      console.log('No voice configurations found matching the criteria.');
      process.exit(0);
    }

    // Filter by group after fetching (since it's a nested relationship)
    let filteredVoices = voices;
    if (groupFilter) {
      filteredVoices = voices.filter(voice => 
        voice.voice_configuration_groups?.name === groupFilter
      );
    }

    if (filteredVoices.length === 0) {
      console.log('No voice configurations found matching the criteria.');
      process.exit(0);
    }

    // Group voices by their group
    const voicesByGroup = {};
    filteredVoices.forEach(voice => {
      const groupName = voice.voice_configuration_groups?.name || 'unknown';
      if (!voicesByGroup[groupName]) {
        voicesByGroup[groupName] = [];
      }
      voicesByGroup[groupName].push(voice);
    });

    // Display results
    console.log(`📋 Found ${filteredVoices.length} voice configuration(s):\n`);

    Object.keys(voicesByGroup).forEach(groupName => {
      const group = voicesByGroup[groupName][0]?.voice_configuration_groups;
      
      console.log(`🎭 ${group?.display_name || groupName.toUpperCase()} GROUP`);
      console.log(`   ${group?.description || ''}\n`);

      voicesByGroup[groupName].forEach((voice, index) => {
        const statusIcon = voice.is_active ? '🟢' : '🔴';
        const planBadge = voice.required_plan.toUpperCase();
        
        console.log(`   ${index + 1}. ${statusIcon} ${voice.display_name}`);
        console.log(`      Internal Name: ${voice.internal_name}`);
        console.log(`      Hume Config ID: ${voice.hume_config_id}`);
        console.log(`      Description: ${voice.description || 'No description'}`);
        console.log(`      Required Plan: ${planBadge}`);
        console.log(`      Base Voice: ${voice.base_voice}`);
        console.log(`      Parameters: Speaking Rate ${voice.parameters?.speaking_rate || 1.0}, Pitch ${voice.parameters?.pitch || 0.0}`);
        console.log(`      Sort Order: ${voice.sort_order}`);
        console.log(`      Status: ${voice.is_active ? 'Active' : 'Inactive'}`);
        console.log(`      Created: ${new Date(voice.created_at).toLocaleDateString()}`);
        console.log(`      Updated: ${new Date(voice.updated_at).toLocaleDateString()}`);
        console.log('');
      });

      console.log('');
    });

    // Summary
    const activeCount = filteredVoices.filter(v => v.is_active).length;
    const inactiveCount = filteredVoices.filter(v => v.is_active === false).length;
    
    console.log('📊 Summary:');
    console.log(`   Total: ${filteredVoices.length} voices`);
    console.log(`   Active: ${activeCount} voices`);
    console.log(`   Inactive: ${inactiveCount} voices`);
    
    // Plan breakdown
    const planBreakdown = {};
    filteredVoices.forEach(voice => {
      planBreakdown[voice.required_plan] = (planBreakdown[voice.required_plan] || 0) + 1;
    });
    
    console.log('\n🎯 Plan Distribution:');
    Object.keys(planBreakdown).forEach(plan => {
      console.log(`   ${plan.toUpperCase()}: ${planBreakdown[plan]} voices`);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

listVoiceConfigurations(); 
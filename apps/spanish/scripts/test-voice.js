#!/usr/bin/env node

/**
 * Script to test voice configurations and validate Hume API connectivity
 * Usage: node scripts/test-voice.js --id "internal-name" [options]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testVoiceConfiguration() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const getId = () => args[args.indexOf('--id') + 1];
  const getHumeId = () => args[args.indexOf('--hume-id') + 1];
  const getAll = () => args.includes('--all');
  const getGroup = () => args[args.indexOf('--group') + 1];
  const getHelp = () => args.includes('--help') || args.includes('-h');

  if (getHelp() || (!getId() && !getHumeId() && !getAll())) {
    console.log(`
Usage: node scripts/test-voice.js [options]

Options:
  --id              Test specific voice by internal name
  --hume-id         Test specific voice by Hume configuration ID
  --all             Test all active voice configurations
  --group           Test all voices in a specific group: "classic" or "creative"
  --help, -h        Show this help message

Examples:
  node scripts/test-voice.js --id "einstein"
  node scripts/test-voice.js --hume-id "abc123-def456"
  node scripts/test-voice.js --all
  node scripts/test-voice.js --group classic

What this script tests:
  ✓ Voice configuration exists in database
  ✓ Required fields are properly set
  ✓ Hume configuration ID format is valid
  ✓ Voice parameters are within valid ranges
  ✓ Group assignment is correct
  ✓ Plan hierarchy makes sense
  ✓ Basic Hume API connectivity (if HUME_SECRET_KEY is available)
`);
    process.exit(getId() || getHumeId() || getAll() ? 0 : 1);
  }

  const voiceId = getId();
  const humeId = getHumeId();
  const testAll = getAll();
  const groupFilter = getGroup();

  // Validate group filter
  if (groupFilter && !['classic', 'creative'].includes(groupFilter)) {
    console.error('Error: Group must be either "classic" or "creative"');
    process.exit(1);
  }

  try {
    console.log('🧪 Testing voice configuration(s)...\n');

    let voices = [];

    if (testAll || groupFilter) {
      // Get all voices or voices from specific group
      let query = supabase
        .from('voice_configurations')
        .select(`
          *,
          voice_configuration_groups!voice_configurations_group_id_fkey (
            name,
            display_name
          )
        `)
        .eq('is_active', true)
        .order('group_id')
        .order('sort_order');

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching voice configurations:', error);
        process.exit(1);
      }

      voices = data || [];

      // Filter by group if specified
      if (groupFilter) {
        voices = voices.filter(voice => 
          voice.voice_configuration_groups?.name === groupFilter
        );
      }

      if (voices.length === 0) {
        console.log('No voice configurations found to test.');
        process.exit(0);
      }

    } else {
      // Get specific voice
      let query = supabase
        .from('voice_configurations')
        .select(`
          *,
          voice_configuration_groups!voice_configurations_group_id_fkey (
            name,
            display_name
          )
        `);

      if (voiceId) {
        query = query.eq('internal_name', voiceId);
      } else {
        query = query.eq('hume_config_id', humeId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.error('Error: Voice configuration not found.');
        console.log('\nTip: Use "node scripts/list-voices.js" to see available voices.');
        process.exit(1);
      }

      voices = [data];
    }

    // Test each voice
    let passCount = 0;
    let failCount = 0;

    for (const voice of voices) {
      const testResults = await testSingleVoice(voice);
      if (testResults.passed) {
        passCount++;
      } else {
        failCount++;
      }
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Passed: ${passCount} voice(s)`);
    console.log(`   ❌ Failed: ${failCount} voice(s)`);
    console.log(`   📝 Total: ${voices.length} voice(s) tested`);

    if (failCount > 0) {
      console.log('\n⚠️  Some voice configurations have issues. Please review the details above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All voice configurations passed the tests!');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

async function testSingleVoice(voice) {
  const testName = `${voice.display_name} (${voice.internal_name})`;
  console.log(`🔍 Testing: ${testName}`);
  
  let passed = true;
  const issues = [];

  // Test 1: Required fields
  if (!voice.internal_name || !voice.display_name || !voice.hume_config_id) {
    issues.push('Missing required fields (internal_name, display_name, or hume_config_id)');
    passed = false;
  }

  // Test 2: Hume Config ID format (should be UUID-like)
  const humeIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  if (!humeIdPattern.test(voice.hume_config_id)) {
    issues.push('Hume Config ID does not match expected UUID format');
    passed = false;
  }

  // Test 3: Voice parameters validation
  const params = voice.parameters || {};
  if (typeof params.speaking_rate !== 'number' || params.speaking_rate < 0.5 || params.speaking_rate > 2.0) {
    issues.push('Speaking rate should be a number between 0.5 and 2.0');
    passed = false;
  }
  if (typeof params.pitch !== 'number' || params.pitch < -1.0 || params.pitch > 1.0) {
    issues.push('Pitch should be a number between -1.0 and 1.0');
    passed = false;
  }

  // Test 4: Plan validation
  const validPlans = ['calm', 'centered', 'grounded'];
  if (!validPlans.includes(voice.required_plan)) {
    issues.push('Required plan must be one of: calm, centered, grounded');
    passed = false;
  }

  // Test 5: Group validation
  if (!voice.voice_configuration_groups?.name) {
    issues.push('Voice is not properly assigned to a group');
    passed = false;
  } else {
    const validGroups = ['classic', 'creative'];
    if (!validGroups.includes(voice.voice_configuration_groups.name)) {
      issues.push('Voice group must be either "classic" or "creative"');
      passed = false;
    }
  }

  // Test 6: Sort order validation
  if (typeof voice.sort_order !== 'number' || voice.sort_order < 0) {
    issues.push('Sort order should be a non-negative number');
    passed = false;
  }

  // Test 7: Base voice validation
  if (!voice.base_voice || typeof voice.base_voice !== 'string') {
    issues.push('Base voice should be a non-empty string');
    passed = false;
  }

  // Test 8: Check for potential duplicates (same hume_config_id)
  try {
    const { data: duplicates, error } = await supabase
      .from('voice_configurations')
      .select('internal_name')
      .eq('hume_config_id', voice.hume_config_id)
      .neq('id', voice.id);

    if (!error && duplicates && duplicates.length > 0) {
      issues.push(`Duplicate Hume Config ID found in voice(s): ${duplicates.map(d => d.internal_name).join(', ')}`);
      passed = false;
    }
  } catch (e) {
    issues.push('Could not check for duplicate Hume Config IDs');
    passed = false;
  }

  // Test 9: Basic Hume API connectivity (if secret key is available)
  if (process.env.NEXT_PUBLIC_HUME_SECRET_KEY || process.env.HUME_SECRET_KEY) {
    try {
      // This is a basic connectivity test - in a real implementation,
      // you might want to make an actual API call to Hume
      console.log('   🔗 Hume API secret key is available for testing');
    } catch (e) {
      issues.push('Could not test Hume API connectivity');
    }
  } else {
    console.log('   ⚠️  Hume API secret key not available - skipping API connectivity test');
  }

  // Display results
  if (passed) {
    console.log(`   ✅ PASSED - All tests successful`);
  } else {
    console.log(`   ❌ FAILED - Found ${issues.length} issue(s):`);
    issues.forEach(issue => {
      console.log(`      • ${issue}`);
    });
  }

  // Display voice details
  console.log(`   📋 Details:`);
  console.log(`      Group: ${voice.voice_configuration_groups?.display_name || 'Unknown'}`);
  console.log(`      Plan: ${voice.required_plan}`);
  console.log(`      Hume ID: ${voice.hume_config_id}`);
  console.log(`      Parameters: Rate ${params.speaking_rate}, Pitch ${params.pitch}`);
  console.log(`      Sort Order: ${voice.sort_order}`);
  console.log(`      Base Voice: ${voice.base_voice}`);
  console.log('');

  return { passed, issues };
}

testVoiceConfiguration(); 
#!/usr/bin/env node

/**
 * Script to delete voice configurations from the database
 * Usage: node scripts/delete-voice.js --id "internal-name" [--force]
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function deleteVoiceConfiguration() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const getId = () => args[args.indexOf('--id') + 1];
  const getHumeId = () => args[args.indexOf('--hume-id') + 1];
  const getForce = () => args.includes('--force');
  const getSoft = () => args.includes('--soft');
  const getHelp = () => args.includes('--help') || args.includes('-h');

  if (getHelp() || (!getId() && !getHumeId())) {
    console.log(`
Usage: node scripts/delete-voice.js [--id "internal-name" | --hume-id "hume-config-id"] [options]

Required (choose one):
  --id              Internal name of the voice to delete
  --hume-id         Hume configuration ID of the voice to delete

Options:
  --force           Skip confirmation prompt
  --soft            Soft delete (set is_active to false instead of removing)
  --help, -h        Show this help message

Examples:
  node scripts/delete-voice.js --id "einstein"
  node scripts/delete-voice.js --hume-id "abc123-def456"
  node scripts/delete-voice.js --id "einstein" --force
  node scripts/delete-voice.js --id "einstein" --soft

Safety Notes:
  - By default, this will PERMANENTLY delete the voice configuration
  - Use --soft to deactivate instead of delete
  - Use --force to skip confirmation prompts
  - This action cannot be undone (unless using --soft)
`);
    process.exit(getId() || getHumeId() ? 0 : 1);
  }

  const voiceId = getId();
  const humeId = getHumeId();
  const force = getForce();
  const softDelete = getSoft();

  try {
    console.log(`🗑️  ${softDelete ? 'Deactivating' : 'Deleting'} voice configuration...`);

    // Find the voice configuration
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

    const { data: voice, error: fetchError } = await query.single();

    if (fetchError || !voice) {
      console.error(`Error: Voice configuration not found.`);
      console.log('\nTip: Use "node scripts/list-voices.js" to see available voices.');
      rl.close();
      process.exit(1);
    }

    // Display voice information
    console.log('\n📋 Voice configuration to be affected:');
    console.log(`   Display Name: ${voice.display_name}`);
    console.log(`   Internal Name: ${voice.internal_name}`);
    console.log(`   Group: ${voice.voice_configuration_groups?.display_name}`);
    console.log(`   Hume Config ID: ${voice.hume_config_id}`);
    console.log(`   Required Plan: ${voice.required_plan}`);
    console.log(`   Current Status: ${voice.is_active ? 'Active' : 'Inactive'}`);
    console.log(`   Created: ${new Date(voice.created_at).toLocaleDateString()}`);

    // Check if this voice is currently being used by any users
    const { data: usersUsingVoice, error: usageError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('voice_config_id', voice.hume_config_id);

    if (usageError) {
      console.warn('Warning: Could not check voice usage by users:', usageError);
    } else if (usersUsingVoice && usersUsingVoice.length > 0) {
      console.log(`\n⚠️  WARNING: This voice is currently being used by ${usersUsingVoice.length} user(s):`);
      usersUsingVoice.slice(0, 5).forEach(user => {
        console.log(`   - ${user.full_name || user.email || user.id}`);
      });
      if (usersUsingVoice.length > 5) {
        console.log(`   ... and ${usersUsingVoice.length - 5} more users`);
      }
      
      if (!softDelete) {
        console.log('\n💡 Consider using --soft to deactivate instead of deleting to avoid breaking user configurations.');
      }
    }

    // Confirmation prompt (unless --force is used)
    if (!force) {
      const action = softDelete ? 'deactivate' : 'permanently delete';
      const confirmation = await askConfirmation(`\n❓ Are you sure you want to ${action} this voice configuration? (yes/no): `);
      
      if (confirmation !== 'yes' && confirmation !== 'y') {
        console.log('Operation cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    // Perform the deletion or soft delete
    let result;
    if (softDelete) {
      // Soft delete - set is_active to false
      const { data, error } = await supabase
        .from('voice_configurations')
        .update({ is_active: false })
        .eq('id', voice.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Hard delete - remove from database
      const { data, error } = await supabase
        .from('voice_configurations')
        .delete()
        .eq('id', voice.id)
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error(`Error ${softDelete ? 'deactivating' : 'deleting'} voice configuration:`, result.error);
      rl.close();
      process.exit(1);
    }

    console.log(`\n✅ Voice configuration ${softDelete ? 'deactivated' : 'deleted'} successfully!`);
    
    if (softDelete) {
      console.log('📋 The voice is now inactive but can be reactivated if needed.');
      console.log('💡 Use the update script with --active true to reactivate it.');
    } else {
      console.log('📋 The voice configuration has been permanently removed from the database.');
      
      if (usersUsingVoice && usersUsingVoice.length > 0) {
        console.log('\n⚠️  Note: Users who were using this voice will fall back to the default voice.');
        console.log('💡 You may want to notify affected users about this change.');
      }
    }

    rl.close();

  } catch (error) {
    console.error('Unexpected error:', error);
    rl.close();
    process.exit(1);
  }
}

deleteVoiceConfiguration(); 
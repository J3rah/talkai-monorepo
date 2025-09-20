#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of diagnostic files to clean up
const diagnosticFiles = [
  'check-admin.js',
  'check-all-recent-profiles.js', 
  'check-auth-status.js',
  'check-plans.js',
  'check-recent-sessions.js',
  'check-user-data.js',
  'create-profile.js',
  'create-profiles.js',
  'create-subscription-tables-manual.js',
  'create-subscription-tables.js',
  'diagnose-session-creation.js',
  'run-migration.js',
  'set-admin.js',
  'test-all-accounts.js',
  'test-auth-connection.js',
  'test-profile-query.js',
  'test-session-creation-flow.js',
  'test-subscription-query.js',
  'test-user-subscription-status.js'
];

console.log('🧹 Cleaning up diagnostic files created during troubleshooting...\n');

let removedCount = 0;
let notFoundCount = 0;

diagnosticFiles.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filename}`);
      removedCount++;
    } else {
      console.log(`⚠️  Not found: ${filename}`);
      notFoundCount++;
    }
  } catch (error) {
    console.log(`❌ Error removing ${filename}:`, error.message);
  }
});

console.log(`\n📊 Cleanup Summary:`);
console.log(`   Removed: ${removedCount} files`);
console.log(`   Not found: ${notFoundCount} files`);

if (removedCount > 0) {
  console.log('\n🎉 Cleanup completed! Your workspace is now clean.');
  console.log('\n📝 Note: The following production files were kept:');
  console.log('   - All app/ components and pages');
  console.log('   - All components/ files');
  console.log('   - supabaseClient.ts');
  console.log('   - Database migration files (.sql)');
  console.log('   - Configuration files (package.json, etc.)');
} else {
  console.log('\n✨ No diagnostic files found - workspace already clean!');
} 
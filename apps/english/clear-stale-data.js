// Clear stale localStorage data and test with real session
console.log('🧹 CLEARING STALE LOCALSTORAGE DATA...');

// Check current localStorage
console.log('Current localStorage:');
console.log('  previousSessionIdToResume:', localStorage.getItem('previousSessionIdToResume'));
console.log('  currentChatSessionId:', localStorage.getItem('currentChatSessionId'));
console.log('  currentTherapySessionId:', localStorage.getItem('currentTherapySessionId'));

// Clear all stale session data
localStorage.removeItem('previousSessionIdToResume');
localStorage.removeItem('currentChatSessionId'); 
localStorage.removeItem('currentTherapySessionId');

// Clear any E0717 retry data
sessionStorage.removeItem('e0717RetryCount');
sessionStorage.removeItem('e0717RetryAttempt');
sessionStorage.removeItem('fallbackVoiceConfig');
sessionStorage.removeItem('hotRefreshSessionId');

console.log('✅ All stale session data cleared!');
console.log('');
console.log('🔧 TO TEST RESUMPTION WITH A REAL SESSION:');
console.log('1. Use a session ID from /test-data that shows "Resumable"');
console.log('2. Run: localStorage.setItem("previousSessionIdToResume", "dbe37855-1550-4ee3-b0b0-476daaebd393")');
console.log('3. Refresh /chat page');
console.log('');
console.log('💡 Most recent resumable session: dbe37855-1550-4ee3-b0b0-476daaebd393'); 
'use client';

import { useEffect, useState } from 'react';
import supabase from '@/supabaseClient';

export default function TestDataPage() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current auth status
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError(`Auth error: ${authError.message}`);
          return;
        }

        setAuthInfo({
          user: user ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          } : null,
          isAuthenticated: !!user
        });

        if (user) {
          // Count sessions for this user
          const { data: sessions, error: sessionsError } = await supabase
            .from('chat_sessions')
            .select('id, title, created_at, hume_chat_group_id, status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (sessionsError) {
            setError(`Sessions error: ${sessionsError.message}`);
          } else {
            setSessionCount(sessions?.length || 0);
            setAllSessions(sessions || []);
          }
        }
      } catch (err) {
        setError(`Unexpected error: ${err}`);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication & Session Diagnostic</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Auth Info */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Authentication Context</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </div>

        {/* Session Count */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Session Count</h2>
          <p className="text-xl">
            {sessionCount !== null ? (
              <span className={sessionCount > 0 ? 'text-green-600' : 'text-red-600'}>
                {sessionCount} sessions found
              </span>
            ) : (
              'Loading...'
            )}
          </p>
        </div>

        {/* Sessions List */}
        {allSessions.length > 0 && (
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Recent Sessions</h2>
            <div className="space-y-2 max-h-96 overflow-auto">
              {allSessions.slice(0, 10).map((session, index) => (
                <div key={session.id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.title || 'Untitled'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.created_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {session.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        session.hume_chat_group_id 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {session.hume_chat_group_id ? 'Resumable' : 'Legacy'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.status || 'No status'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expected vs Actual User ID */}
        <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Diagnostic Info</h2>
          <p className="text-sm mb-2">
            <strong>Expected User ID from SQL:</strong>{' '}
            <code className="bg-gray-100 px-1 rounded">124361c2-db51-465e-a4e6-98894ceacd1e</code>
          </p>
          <p className="text-sm mb-2">
            <strong>Actual User ID from App:</strong>{' '}
            <code className="bg-gray-100 px-1 rounded">
              {authInfo?.user?.id || 'Not authenticated'}
            </code>
          </p>
          <p className="text-sm">
            <strong>Match:</strong>{' '}
            <span className={
              authInfo?.user?.id === '124361c2-db51-465e-a4e6-98894ceacd1e' 
                ? 'text-green-600 font-semibold' 
                : 'text-red-600 font-semibold'
            }>
              {authInfo?.user?.id === '124361c2-db51-465e-a4e6-98894ceacd1e' ? 'YES ✅' : 'NO ❌'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 
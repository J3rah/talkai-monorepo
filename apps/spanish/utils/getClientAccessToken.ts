export const getClientAccessToken = async () => {
  try {
    console.log('🔑 getClientAccessToken: Starting fetch to /api/access-token');
    const response = await fetch('/api/access-token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Prevent caching issues
    });
    
    console.log('🔍 getClientAccessToken: Response status:', response.status, response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ getClientAccessToken: Response not ok:', response.status, errorText);
      throw new Error(`Failed to fetch access token: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ getClientAccessToken: Successfully received data:', !!data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('❌ getClientAccessToken: Error details:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('❌ getClientAccessToken: Network error - check if server is running and API route is accessible');
    }
    return null;
  }
}; 
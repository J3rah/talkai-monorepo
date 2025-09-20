export const getClientAccessToken = async () => {
  try {
    const response = await fetch('/api/access-token');
    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}; 
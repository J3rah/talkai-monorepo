import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  try {
    console.log('🔑 Fetching Hume access token...');
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY)
    });

    if (!accessToken || accessToken === "undefined") {
      console.error('❌ Invalid access token received from Hume SDK');
      return null;
    }

    console.log('✅ Successfully fetched Hume access token');
    return accessToken;
  } catch (error) {
    console.error('❌ Error fetching Hume access token:', error);
    return null;
  }
};

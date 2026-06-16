const { AccessToken } = require('livekit-server-sdk');

/**
 * Generate a LiveKit access token for a participant.
 * The frontend uses this token to join the room and receive avatar video.
 */
async function generateLiveKitToken(roomName, participantName, isPublisher = false) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in .env');
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: '4h',
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isPublisher,      // only the bridge publishes audio
    canSubscribe: true,            // everyone can receive video/audio
    canPublishData: isPublisher,
  });

  return await token.toJwt();
}

module.exports = { generateLiveKitToken };

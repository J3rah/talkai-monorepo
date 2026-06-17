/**
 * AvatarDisplay.tsx
 *
 * Subscribes to the bridge's LiveKit room and renders the LiveAvatar video track.
 * The avatar (LiveAvatar LITE) joins the same room as a participant, lip-syncs to
 * the Hume audio the bridge publishes there, and publishes its video back — which
 * we attach here.
 */

'use client';

import { useEffect, useRef } from 'react';
import { Room, RoomEvent, Track, type RemoteTrack } from 'livekit-client';

interface AvatarDisplayProps {
  livekitUrl: string;
  livekitToken: string;
  className?: string;
}

export default function AvatarDisplay({
  livekitUrl,
  livekitToken,
  className = '',
}: AvatarDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    if (!livekitUrl || !livekitToken || !containerRef.current) return;

    let cancelled = false;
    const room = new Room();
    roomRef.current = room;

    const attach = (track: RemoteTrack) => {
      if (track.kind !== Track.Kind.Video || !containerRef.current) return;
      // Don't play the avatar's audio (the user already hears Hume via the chat).
      console.log('🎭 Attaching avatar video track');
      const el = track.attach() as HTMLVideoElement;
      el.style.width = '100%';
      el.style.height = '100%';
      el.style.objectFit = 'cover';
      el.muted = true;
      containerRef.current.querySelectorAll('video').forEach((v) => v.remove());
      containerRef.current.appendChild(el);
    };

    room
      .on(RoomEvent.TrackSubscribed, (track) => attach(track))
      .on(RoomEvent.Disconnected, () => console.log('🎭 Avatar room disconnected'));

    (async () => {
      try {
        console.log('🎭 Connecting to LiveKit room for avatar video...');
        await room.connect(livekitUrl, livekitToken);
        if (cancelled) {
          await room.disconnect();
          return;
        }
        console.log('✅ Avatar room connected');
        // Attach any video tracks already published before we subscribed.
        room.remoteParticipants.forEach((p) => {
          p.trackPublications.forEach((pub) => {
            if (pub.track && pub.kind === Track.Kind.Video) attach(pub.track as RemoteTrack);
          });
        });
      } catch (err) {
        console.error('❌ AvatarDisplay LiveKit connect failed:', err);
      }
    })();

    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, [livekitUrl, livekitToken]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Fallback shown until the avatar video track arrives */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50 pointer-events-none">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-2">👤</div>
          <p>Connecting avatar...</p>
        </div>
      </div>
    </div>
  );
}

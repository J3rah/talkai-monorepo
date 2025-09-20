"use client";

import { usePathname } from 'next/navigation';
import CookieConsent from './CookieConsent';

function ConditionalCookieConsent() {
  const pathname = usePathname();

  // Hide on /auth, any /session paths, and any /sessions paths
  if (
    pathname === '/auth' ||
    pathname?.startsWith('/auth/') ||
    pathname === '/session' ||
    pathname?.startsWith('/session/') ||
    pathname === '/sessions' ||
    pathname?.startsWith('/sessions/')
  ) {
    return null;
  }

  return <CookieConsent />;
}

export default ConditionalCookieConsent;

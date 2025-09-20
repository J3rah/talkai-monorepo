"use client";

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on home page, chat pages, sessions page, and rechat pages
  if (pathname === '/' || pathname === '/chat' || pathname?.startsWith('/chat/') || pathname === '/sessions' || pathname?.startsWith('/rechat/')) {
    return null;
  }
  
  return <Footer />;
}

export default ConditionalFooter; 
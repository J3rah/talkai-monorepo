"use client";

import { usePathname } from 'next/navigation';
import { Nav } from './Nav';

function ConditionalNav() {
  const pathname = usePathname();
  
  // Hide nav on home page (/) since it has its own landing experience
  if (pathname === '/') {
    return null;
  }
  
  return <Nav />;
}

export default ConditionalNav;

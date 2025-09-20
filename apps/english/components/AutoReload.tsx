"use client";
import React from "react";

export default function AutoReload() {
  React.useEffect(() => {
    // Disable auto-reload unless explicitly enabled via env variable
    if (process.env.NEXT_PUBLIC_ENABLE_AUTO_RELOAD !== 'true') {
      return;
    }

    console.log("🔄 AutoReload: Component mounted");
    
    if (typeof window === "undefined") {
      console.log("🔄 AutoReload: Window undefined, skipping");
      return;
    }

    const path = window.location.pathname;
    // Skip on auth routes or routes that require auth/stateful navigation
    if (path.startsWith('/auth') || path.startsWith('/sessions') || path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/chat')) {
      console.log("🔄 AutoReload: Skipping on protected route:", path);
      return;
    }

    // Create a route-specific key
    const routeKey = `autoReload-${path}`;
    console.log("🔄 AutoReload: Route key =", routeKey);

    // Check if we've already reloaded this specific route
    const hasReloaded = sessionStorage.getItem(routeKey);
    if (hasReloaded) {
      console.log("🔄 AutoReload: Already reloaded this route, skipping");
      return;
    }

    console.log("🔄 AutoReload: Scheduling reload in 3 seconds...");

    // Reload once after 3 seconds
    const timeout = setTimeout(() => {
      console.log("🔄 AutoReload: Executing reload now!");
      // Mark that we've reloaded this specific route
      sessionStorage.setItem(routeKey, 'true');
      window.location.reload();
    }, 3000);

    return () => {
      console.log("🔄 AutoReload: Cleanup - clearing timeout");
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
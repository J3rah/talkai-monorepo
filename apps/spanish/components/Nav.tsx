"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, LogIn, LogOut, Menu, X, Loader2, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import TalkAILogo from "./logos/TalkAI";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../supabaseClient";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { useTheme } from "next-themes";
import Toast from "./Toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const Nav = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety mechanism: reset logout state when user becomes null
  useEffect(() => {
    if (!user) {
      setIsLoggingOut(false);
    }
  }, [user]);

  // Fetch user profile when user is authenticated
  const fetchUserProfile = async (userId: string) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();
      
      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let authSubscription: any = null;
    let timeoutId: NodeJS.Timeout;

    // Get initial user with debouncing and timeout
    const checkUser = async () => {
      if (!isMounted) return;
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log('Nav: User check timeout, proceeding without auth');
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
          setUserProfile(null);
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout to allow session hydration
      
      try {
        // Prefer session-based check (faster when available)
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (session?.user) {
          clearTimeout(timeoutId);
          const currentUser = session.user;
          setUser(currentUser);
          await fetchUserProfile(currentUser.id);
          await checkAdminStatus();
          setIsLoading(false);
          return; // Done
        }
        
        // Fallback to getUser if no session found
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        
        clearTimeout(timeoutId);
        setUser(user);
        
        if (user) {
          await fetchUserProfile(user.id);
          await checkAdminStatus();
        } else {
          setIsAdmin(false);
          setUserProfile(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Nav: Error checking user:', error);
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener with debouncing
    const setupAuthListener = () => {
      authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        
        console.log('Nav: Auth state change:', event, session ? 'has session' : 'no session');
        
        const user = session?.user ?? null;
        setUser(user);
        
        if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
          await fetchUserProfile(user.id);
          await checkAdminStatus();
        } else if (event === 'SIGNED_OUT' || !user) {
          // Ensure we reset all states when user signs out
          setIsAdmin(false);
          setUserProfile(null);
          setIsLoggingOut(false);
        }
      });
    };

    setupAuthListener();
    checkUser();

    // Cleanup subscription
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        return;
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 3000)
      );
      
      const adminCheckPromise = fetch('/api/admin/check', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const response = await Promise.race([adminCheckPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin || false);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const toggleDark = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    console.log('🔄 Starting logout process...');
    setIsLoggingOut(true);
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Logout timeout, resetting state');
      setIsLoggingOut(false);
    }, 10000); // 10 second timeout
    
    try {
      console.log('📡 Calling Supabase signOut...');
      const { error } = await supabase.auth.signOut();
      
      clearTimeout(timeoutId); // Clear timeout on success
      
      if (error) {
        console.error('❌ Error signing out:', error);
        setIsLoggingOut(false);
        // Could add a toast notification here in the future
        return;
      }
      
      console.log('✅ SignOut successful, clearing local state...');
      // Clear local state immediately
      setUser(null);
      setIsAdmin(false);
      setUserProfile(null);
      
      // Reset loading state
      setIsLoggingOut(false);
      
      // Show success notification
      setShowLogoutToast(true);
      
      console.log('🔄 Navigating to home page...');
      // Navigate to home page
      router.push('/');
      
      // Add a small delay to ensure navigation completes
      setTimeout(() => {
        console.log('✅ Navigation completed');
      }, 100);
      
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      console.error('❌ Error in logout:', error);
      setIsLoggingOut(false);
      // Could add a toast notification here in the future
    }
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Chat
      </Link>
      <Link
        href="/faq"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/faq' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        FAQ
      </Link>
      <Link
        href="/blog"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname?.startsWith('/blog') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Blog
      </Link>
      {/* <Link
        href="/journal"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname?.startsWith('/journal') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Journal
      </Link> */}
      <Link
        href="/mental-health-resources"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/mental-health-resources' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Resources
      </Link>
      <Link
        href="/subscription"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/subscription' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Pricing
      </Link>
      <Link
        href="/about"
        className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/about' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        About
      </Link>
      {/* Social Media Icons under About */}
      <div className="flex items-center gap-4 mt-2 mb-2 px-3">
        <Link href="https://x.com/talkai_im" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Twitter className="h-5 w-5" />
        </Link>
        <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Instagram className="h-5 w-5" />
        </Link>
        <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Facebook className="h-5 w-5" />
        </Link>
        <Link href="https://www.linkedin.com/company/talkai_im" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors p-1" target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-5 w-5" />
        </Link>
      </div>
      <hr className="border-t border-border my-2 mx-3" />
      {user && (
        <>
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded transition-colors font-medium ${pathname === '/admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <div className="px-4 py-6 flex items-center h-20 z-50 border-b border-border bg-background">
        <div>
          <Link href="/">
            <TalkAILogo className="h-24 w-auto -mt-8" />
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <div className="ml-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <Link href="/">
                  <TalkAILogo className="mx-auto my-4 w-48 h-24" />
                </Link>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            onClick={toggleDark}
            variant="ghost"
            className="flex items-center gap-1.5"
          >
            <span>
              {!mounted ? (
                <Sun className="size-4" />
              ) : theme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </span>
            <span className="sr-only">{!mounted ? "Theme" : theme === "light" ? "Switch to Dark" : "Switch to Light"} Mode</span>
          </Button>
          
          {/* User Name Dropdown Menu */}
          {user && userProfile && !isLoading && (
            <div
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-medium px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {userProfile.full_name || userProfile.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=account">Settings</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {isLoading ? (
            <Button variant="ghost" className="flex items-center gap-1.5" disabled>
              <Loader2 className="size-5 animate-spin" />
            </Button>
          ) : user ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-1.5"
              title={isLoggingOut ? "Logging out..." : "Logout"}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <LogOut className="size-5" />
              )}
            </Button>
          ) : (
            <Link href="/auth" title="Login">
              <Button variant="ghost" className="flex items-center gap-1.5">
                <LogIn className="size-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Logout Success Toast */}
      {showLogoutToast && (
        <Toast
          message="Successfully logged out!"
          type="success"
          duration={3000}
          onClose={() => setShowLogoutToast(false)}
        />
      )}
    </>
  );
};

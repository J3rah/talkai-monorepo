"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../supabaseClient';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AutoReload from '@/components/AutoReload';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth');
          return;
        }

        // Use the API route to check admin status instead of direct database query
        const response = await fetch('/api/admin/check', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          console.error('Admin check failed:', response.status);
          router.push('/');
          return;
        }

        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin);
        
        if (!isAdmin) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Don't render anything if not admin (will redirect)
  if (isAdmin === false) {
    return null;
  }

  // Only render if we're sure the user is an admin
  if (isAdmin !== true) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AutoReload />
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold">
                Admin Dashboard
              </Link>
              <div className="flex space-x-4">
                <Link href="/admin/agents">
                  <Button variant="ghost">Agents</Button>
                </Link>
                <Link href="/admin/agents/x-engagement">
                  <Button variant="ghost">X Agent</Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost">Users</Button>
                </Link>
                <Link href="/admin/journals">
                  <Button variant="ghost">Journals</Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="ghost">Settings</Button>
                </Link>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/auth');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 
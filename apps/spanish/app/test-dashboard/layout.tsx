"use client";

import AutoReload from '@/components/AutoReload';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AutoReload />
      {children}
    </div>
  );
} 
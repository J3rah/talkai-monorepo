import { useState } from 'react';
import supabase from '../../supabaseClient';
import { Button } from '../ui/button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Use an explicit base URL so Supabase builds the reset-password link for the
    // correct (allowed) domain in production. Fallback to the current origin in
    // development.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const redirectToUrl = `${baseUrl}/auth/reset-password`;

    console.log('📧 Sending password reset with redirectTo:', redirectToUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectToUrl,
    });
    setMessage(error ? error.message : 'Password reset email sent!');
    setLoading(false);
  };

  return (
    <form onSubmit={handleForgotPassword} className="space-y-4 max-w-sm mx-auto p-6 bg-card rounded-lg shadow">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
      />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Email'}</Button>
      {message && <p className="text-center text-sm text-muted-foreground mt-2">{message}</p>}
    </form>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import { Copy, Send, Loader2, X, Users, Link as LinkIcon, Mail } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import supabase from '@/supabaseClient';

interface Props {
  referralCode: string | null;
  minutesPerReward?: number;
  minutesBalance?: number;
  referralsCount?: number;
  variant?: 'sidebar' | 'modal';
}

export default function ReferralInvite({ 
  referralCode, 
  minutesPerReward = 15, 
  minutesBalance = 0, 
  referralsCount = 0,
  variant = 'modal'
}: Props) {
  const [open, setOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [alreadyInvited, setAlreadyInvited] = useState(false);
  const [referrals, setReferrals] = useState<Array<{ email: string | null; full_name: string | null; created_at: string }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (referralCode) {
      setInviteUrl(`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}?ref=${referralCode}`);
    }
  }, [referralCode]);

  useEffect(() => {
    if (open) {
      (async () => {
        setHistoryLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('referrals')
            .select(
              `created_at, referred:referred_id (email, full_name)`
            )
            .eq('referrer_id', user.id)
            .order('created_at', { ascending: false });
          if (!error && data) {
            const mapped = data.map((row: any) => ({
              email: row.referred?.email || null,
              full_name: row.referred?.full_name || null,
              created_at: row.created_at,
            }));
            setReferrals(mapped);
          }
        }
        setHistoryLoading(false);
      })();
    }
  }, [open]);

  const copyToClipboard = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = async () => {
    if (!email || !inviteUrl) return;
    // simple email send via Supabase function or your backend (stub)
    try {
      const res = await fetch('/api/email/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alreadyInvited) {
          setAlreadyInvited(true);
          setSent(false);
          setAlreadyRegistered(false);
          setTimeout(() => setAlreadyInvited(false), 5000);
        } else if (data.alreadyRegistered) {
          setAlreadyRegistered(true);
          setSent(false);
          setTimeout(() => setAlreadyRegistered(false), 5000);
        } else {
          setSent(true);
          setAlreadyRegistered(false);
          setAlreadyInvited(false);
          setTimeout(() => setSent(false), 4000);
        }
      } else {
        // handle error silently or toast
        setAlreadyRegistered(false);
      }
    } catch (err) {
      console.error('Error sending invite', err);
    }
  };

  if (!referralCode) return null; // user not loaded yet

  // Sidebar variant - compact design
  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 w-full p-3 rounded-lg bg-card hover:bg-accent transition-colors border border-border"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">Share TalkAI</p>
            <p className="text-xs text-muted-foreground">Get {minutesPerReward} minutes each</p>
          </div>
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-card border border-border">
            <DialogHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold">Invite to get minutes</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Share your invitation link with friends, get {minutesPerReward} minutes each.
              </p>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Share invitation link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Share your invitation link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm border border-border"
                  />
                  <Button 
                    onClick={copyToClipboard} 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Email invitation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email your invitation</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm border border-border"
                  />
                  <Button 
                    onClick={sendInvite} 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {sent ? 'Sent!' : 'Send'}
                  </Button>
                </div>
                {sent && !alreadyRegistered && !alreadyInvited && (
                  <p className="text-sm text-green-600">Email sent successfully!</p>
                )}
                {alreadyRegistered && (
                  <p className="text-sm text-yellow-600">This user already has an account.</p>
                )}
                {alreadyInvited && (
                  <p className="text-sm text-yellow-600">This user has already been invited.</p>
                )}
              </div>

              {/* Invitation history */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground text-center mb-4">Invitation history</h4>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{referralsCount * minutesPerReward}</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{referralsCount}</p>
                    <p className="text-xs text-muted-foreground">Referrals</p>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <button className="text-primary hover:underline">Redeem</button>
                  <button className="text-primary hover:underline">Invitation history &gt;</button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default modal variant - for account page
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-between w-full p-4 rounded-xl border bg-card hover:bg-muted transition-colors"
      >
        <div>
          <p className="font-medium text-foreground">Share TalkAI with a friend</p>
          <p className="text-sm text-muted-foreground">Get {minutesPerReward} minutes each</p>
          <p className="text-xs text-foreground mt-1">You have {minutesBalance} free minutes | {referralsCount} referrals</p>
        </div>
        <span className="text-foreground">&gt;</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to get minutes</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Share your invitation link with friends, get {minutesPerReward} minutes each.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                {copied ? '✓' : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="inviteEmail" className="text-sm font-medium">Email your invitation</label>
              <div className="flex gap-2">
                <input
                  id="inviteEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm"
                />
                <Button onClick={sendInvite} size="icon" variant="outline">
                  {sent ? '✓' : <Send className="w-4 h-4" />}
                </Button>
              </div>
              {sent && !alreadyRegistered && !alreadyInvited && (
                <p className="text-sm text-green-600">Email sent successfully!</p>
              )}
              {alreadyRegistered && (
                <p className="text-sm text-yellow-600">This user already has an account.</p>
              )}
              {alreadyInvited && (
                <p className="text-sm text-yellow-600">This user has already been invited.</p>
              )}
            </div>
            {/* Placeholder invitation history; to be wired with backend */}
            <div className="mt-4">
              <h4 className="font-medium text-foreground mb-2">Invitation history</h4>
              {historyLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : referrals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No referrals yet.</p>
              ) : (
                <ul className="text-sm space-y-2 max-h-48 overflow-y-auto pr-2">
                  {referrals.map((r, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border pb-1">
                      <span>{r.full_name || r.email || 'Friend'}</span>
                      <span className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 
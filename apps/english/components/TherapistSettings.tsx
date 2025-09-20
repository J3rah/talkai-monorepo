"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import supabase from "@/supabaseClient";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TherapistSettings({ 
  onNameChange, 
  className, 
  isTrialMode = false 
}: { 
  onNameChange?: (name: string) => void, 
  className?: string,
  isTrialMode?: boolean 
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapistName = async () => {
      try {
        console.log('TherapistSettings: fetchTherapistName called, isTrialMode:', isTrialMode);
        
        // Skip authentication check in trial mode
        if (isTrialMode) {
          console.log('TherapistSettings: Trial mode detected, skipping auth check');
          setLoading(false);
          return;
        }

        console.log('TherapistSettings: Not in trial mode, checking authentication...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('TherapistSettings: No authenticated user found, redirecting to auth page');
          router.push('/auth');
          return;
        }

        console.log('TherapistSettings: User authenticated, fetching profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('therapist_name')
          .eq('id', user.id)
          .single();

        console.log('TherapistSettings: Profile fetch result:', {
          profileData: profile,
          error: profileError,
          hasTherapistName: !!profile?.therapist_name
        });

        if (profileError) {
          console.error('TherapistSettings: Error fetching profile:', {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
          });
        }

        if (profile?.therapist_name) {
          console.log('TherapistSettings: Found therapist name:', profile.therapist_name);
          setTherapistName(profile.therapist_name);
        } else {
          console.log('TherapistSettings: No therapist name found in profile, using default');
        }
      } catch (error) {
        console.error('TherapistSettings: Error in fetchTherapistName:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistName();
  }, [router, isTrialMode]);

  const handleSaveName = async () => {
    try {
      console.log('TherapistSettings: handleSaveName called, therapistName:', therapistName, 'isTrialMode:', isTrialMode);
      
      // In trial mode, just update locally
      if (isTrialMode) {
        console.log('TherapistSettings: Trial mode, saving locally only');
        onNameChange?.(therapistName);
        setIsOpen(false);
        return;
      }

      console.log('TherapistSettings: Not in trial mode, checking auth for save...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('TherapistSettings: No authenticated user for save, redirecting to auth page');
        router.push('/auth');
        return;
      }

      console.log('TherapistSettings: Updating profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          therapist_name: therapistName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      console.log('TherapistSettings: Profile update result:', {
        data: data,
        error: error,
        therapistNameSet: data?.therapist_name
      });

      if (error) {
        console.error('TherapistSettings: Error saving therapist name:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('TherapistSettings: Successfully saved therapist name:', data);
      onNameChange?.(therapistName);
      setIsOpen(false);
    } catch (error) {
      console.error('TherapistSettings: Error in handleSaveName:', error);
      alert('Failed to save therapist name. Please try again.');
    }
  };

  if (loading) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <User className="size-4 mr-2" />
        {therapistName}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Therapist Settings</DialogTitle>
            <DialogDescription>
              {isTrialMode 
                ? "Customize your AI therapist's name for this trial session"
                : "Customize your AI therapist's name"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="therapist-name">Therapist Name</Label>
              <Input
                id="therapist-name"
                value={therapistName}
                onChange={(e) => setTherapistName(e.target.value)}
                placeholder="Enter therapist name"
              />
            </div>

            <Button
              onClick={handleSaveName}
              className="w-full"
            >
              {isTrialMode ? 'Set Name for Trial' : 'Save Name'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 
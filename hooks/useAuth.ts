'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types/user';

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  subscription_active: boolean;
  role: 'user' | 'admin';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, subscription_active, role')
            .eq('id', session.user.id)
            .single();

          if (!mounted) return;

          const typedProfile = profile as Profile | null;
          if (typedProfile) {
            setUser({
              id: session.user.id,
              name: typedProfile.name,
              email: session.user.email || null,
              avatar_url: typedProfile.avatar_url,
              role: typedProfile.role,
              subscription_active: typedProfile.subscription_active,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const isAdmin = user?.role === 'admin';
  const hasSubscription = user?.subscription_active || false;
  const canCreateOffers = isAdmin || hasSubscription;

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, isAdmin, hasSubscription, canCreateOffers, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut };
}

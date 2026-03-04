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
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, subscription_active, role')
            .eq('id', session.user.id)
            .single();

          const typedProfile = profile as Profile | null;

          if (typedProfile) {
            setUser({
              id: session.user.id,
              name: typedProfile.name,
              email: session.user.email || null,
              avatar_url: typedProfile.avatar_url,
              role: typedProfile.role,
              subscription_active: typedProfile.subscription_active,
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: session.user.updated_at || new Date().toISOString(),
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user or profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = user?.role === 'admin';
  const hasSubscription = user?.subscription_active || false;
  const canCreateOffers = isAdmin || hasSubscription;

  return { user, loading, isAdmin, canCreateOffers };
}

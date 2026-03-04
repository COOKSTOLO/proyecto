'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Offer, OfferWithUser, CreateOfferDto } from '@/types/offer';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useOffers() {
  const [offers, setOffers] = useState<OfferWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();

    // Subscribe to realtime changes
    const channel: RealtimeChannel = supabase
      .channel('offers-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
        },
        () => {
          // Refetch offers when changes occur
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          user:profiles(name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOffers(data as OfferWithUser[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (offerData: CreateOfferDto): Promise<Offer | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('offers')
        .insert(
          {
            ...offerData,
            user_id: user.id,
          } as any
        )
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error creating offer:', err);
      throw err;
    }
  };

  const deleteOffer = async (offerId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting offer:', err);
      throw err;
    }
  };

  const toggleLike = async (offerId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes iniciar sesión para dar like');
      }

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('offer_id', offerId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', offerId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert(
            {
              user_id: user.id,
              offer_id: offerId,
            } as any
          );

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      throw err;
    }
  };

  return {
    offers,
    loading,
    error,
    createOffer,
    deleteOffer,
    toggleLike,
    refetch: fetchOffers,
  };
}

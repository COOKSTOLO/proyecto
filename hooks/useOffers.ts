'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Offer, OfferWithUser, CreateOfferDto } from '@/types/offer';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useOffers() {
  console.log('📦 useOffers: Hook initialized');
  const [offers, setOffers] = useState<OfferWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📦 useOffers: useEffect triggered');
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
      console.log('📦 useOffers: Fetching offers...');
      setLoading(true);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          user:profiles!user_id(name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      const endTime = performance.now();
      console.log(`📦 useOffers: Query took ${(endTime - startTime).toFixed(2)}ms`);

      if (error) {
        console.error('❌ useOffers: Error fetching offers:', error);
        throw error;
      }

      console.log(`✅ useOffers: Fetched ${data?.length || 0} offers`);
      setOffers(data as OfferWithUser[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
      console.log('📦 useOffers: Loading complete');
    }
  };

  const createOffer = async (offerData: CreateOfferDto): Promise<Offer | null> => {
    try {
      console.log('📦 useOffers: Creating offer...', offerData.title);
      const startTime = performance.now();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ useOffers: No user authenticated');
        throw new Error('Usuario no autenticado');
      }

      console.log('📦 useOffers: User ID:', user.id);

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

      const endTime = performance.now();
      console.log(`📦 useOffers: Insert took ${(endTime - startTime).toFixed(2)}ms`);

      if (error) {
        console.error('❌ useOffers: Error creating offer:', error);
        throw error;
      }

      console.log('✅ useOffers: Offer created successfully:', data.id);
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

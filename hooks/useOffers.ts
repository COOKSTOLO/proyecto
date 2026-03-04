'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Offer, OfferWithUser, CreateOfferDto } from '@/types/offer';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useOffers() {
  const [offers, setOffers] = useState<OfferWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id, title, price, image_url, description, affiliate_link, user_id, likes_count, source, status, created_at, updated_at,
          user:profiles!user_id(name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        setError('Failed to fetch offers. Please try again later.');
        return;
      }

      setOffers(data || []);
    } catch {
      setError('An unexpected error occurred while fetching offers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers(20);
  }, [fetchOffers]);

  const createOffer = async (offerData: CreateOfferDto): Promise<Offer> => {
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
      const createdOffer = data as Offer;
      return createdOffer;
    } catch (err) {
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
      throw err;
    }
  };

  const toggleLike = async (offerId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes iniciar sesión para dar like');
      }

      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('offer_id', offerId)
        .single();

      if (existingLike) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', offerId);

        if (error) throw error;
      } else {
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

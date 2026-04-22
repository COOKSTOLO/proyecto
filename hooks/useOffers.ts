'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Offer, OfferWithUser, CreateOfferDto, OfferCategory } from '@/types/offer';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useOffers(sort: 'new' | 'top' = 'new') {
  const [offers, setOffers] = useState<OfferWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedOfferIds, setLikedOfferIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchUserLikes = useCallback(async (offerIds: string[]) => {
    if (offerIds.length === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('likes')
      .select('offer_id')
      .eq('user_id', user.id)
      .in('offer_id', offerIds);
    if (data) {
      setLikedOfferIds(new Set(data.map((l: any) => l.offer_id as string)));
    }
  }, []);

  const fetchOffers = useCallback(async (limit = 20, category?: OfferCategory | null, sortBy: 'new' | 'top' = 'new') => {
    setLoading(true);
    setError(null);
    try {
      const orderCol = sortBy === 'top' ? 'likes_count' : 'created_at';
      const query = supabase
        .from('offers')
        .select(`
          id, title, price, original_price, image_url, description, affiliate_link, user_id, likes_count, source, status, category, created_at, updated_at,
          user:profiles!user_id(name, avatar_url)
        `)
        .eq('status', 'active')
        .order(orderCol, { ascending: false })
        .limit(limit);

      const { data, error } = category
        ? await query.eq('category', category)
        : await query;

      if (error) {
        setError('Failed to fetch offers. Please try again later.');
        return;
      }

      const fetched = (data || []) as OfferWithUser[];
      setOffers(fetched);
      fetchUserLikes(fetched.map((o) => o.id));
    } catch {
      setError('An unexpected error occurred while fetching offers.');
    } finally {
      setLoading(false);
    }
  }, [fetchUserLikes]);

  // Realtime: sincroniza likes_count cuando otros usuarios dan like
  useEffect(() => {
    channelRef.current = supabase
      .channel('offers-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'offers' },
        (payload) => {
          const updated = payload.new as Offer;
          setOffers((prev) =>
            prev.map((o) =>
              o.id === updated.id ? { ...o, likes_count: updated.likes_count } : o
            )
          );
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetchOffers(20, undefined, sort);
  }, [fetchOffers, sort]);

  // Tambien refrescar liked IDs si cambia la sesión
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setOffers((prev) => {
        fetchUserLikes(prev.map((o) => o.id));
        return prev;
      });
    });
    return () => subscription.unsubscribe();
  }, [fetchUserLikes]);

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Debes iniciar sesión para dar like');

    const isLiked = likedOfferIds.has(offerId);

    // Optimistic update: respuesta inmediata en la UIaaaaaaaaaaaaaaaaaaaaaaaaaaadawdawdaawwdawdaw
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? { ...o, likes_count: Math.max(0, o.likes_count + (isLiked ? -1 : 1)) }
          : o
      )
    );
    setLikedOfferIds((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(offerId) : next.add(offerId);
      return next;
    });

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', offerId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, offer_id: offerId } as any);
        if (error) throw error;
      }
    } catch (err) {
      // Rollback si falla el servidor
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, likes_count: Math.max(0, o.likes_count + (isLiked ? 1 : -1)) }
            : o
        )
      );
      setLikedOfferIds((prev) => {
        const next = new Set(prev);
        isLiked ? next.add(offerId) : next.delete(offerId);
        return next;
      });
      throw err;
    }
  };

  return {
    offers,
    loading,
    error,
    likedOfferIds,
    createOffer,
    deleteOffer,
    toggleLike,
    refetch: fetchOffers,
  };
}

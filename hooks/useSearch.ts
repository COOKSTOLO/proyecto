'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { OfferWithUser } from '@/types/offer';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OfferWithUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    const term = q.trim();
    if (term.length < MIN_CHARS) {
      setResults([]);
      setSearching(false);
      return;
    }

    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setSearching(true);
    setError(null);

    try {
      const { data, error: sbError } = await supabase
        .from('offers')
        .select(`
          id, title, price, image_url, description, affiliate_link,
          likes_count, category, created_at,
          user:profiles!user_id(name, avatar_url)
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
        .order('likes_count', { ascending: false })
        .limit(15)
        .abortSignal(signal);

      if (signal.aborted) return;

      if (sbError) {
        setError('Error al buscar');
        return;
      }

      setResults((data ?? []) as OfferWithUser[]);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      setError('Error al buscar');
    } finally {
      if (!abortRef.current?.signal?.aborted) {
        setSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.trim().length < MIN_CHARS) {
      setResults([]);
      setSearching(false);
      return;
    }

    // Show loading immediately; actual request fires after debounce
    setSearching(true);
    timerRef.current = setTimeout(() => search(query), DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setSearching(false);
    if (abortRef.current) abortRef.current.abort();
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { query, setQuery, results, searching, error, clearSearch };
}

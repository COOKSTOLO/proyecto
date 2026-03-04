import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import OfferDetailClient from './OfferDetailClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OfferDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: offer, error } = await supabase
    .from('offers')
    .select(`
      *,
      user:profiles(name, avatar_url, email)
    `)
    .eq('id', id)
    .single();

  if (error || !offer) {
    notFound();
  }

  return <OfferDetailClient offer={offer} />;
}

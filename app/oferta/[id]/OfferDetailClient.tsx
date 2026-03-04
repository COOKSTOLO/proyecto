'use client';

import Image from 'next/image';
import Link from 'next/link';
import { OfferWithUser } from '@/types/offer';
import { formatPrice } from '@/utils/formatPrice';
import { formatRelativeTime } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface OfferDetailClientProps {
  offer: OfferWithUser;
}

export default function OfferDetailClient({ offer }: OfferDetailClientProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offer.id);

      if (error) throw error;

      router.push('/');
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error al eliminar la oferta');
    }
  };

  const canDelete = user && (user.id === offer.user_id || isAdmin);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
      >
        ← Volver al feed
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {offer.title}
            </h1>

            <div className="text-4xl font-bold text-orange-600 mb-6">
              {formatPrice(offer.price)}
            </div>

            {offer.description && (
              <p className="text-gray-700 mb-6">{offer.description}</p>
            )}

            {/* User Info */}
            {offer.user && (
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                {offer.user.avatar_url && (
                  <Image
                    src={offer.user.avatar_url}
                    alt={offer.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {offer.user.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Publicado {formatRelativeTime(offer.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p>❤️ {offer.likes_count} me gusta</p>
              <p>
                📦 Fuente:{' '}
                {offer.source === 'scraper' ? 'Automática' : 'Manual'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <a
                href={offer.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-orange-600 text-white text-center rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Ver Oferta 🔥
              </a>

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="block w-full px-6 py-3 bg-red-500 text-white text-center rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Eliminar Oferta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

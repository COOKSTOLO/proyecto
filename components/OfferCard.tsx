'use client';

import Image from 'next/image';
import Link from 'next/link';
import { OfferWithUser } from '@/types/offer';
import { formatPrice } from '@/utils/formatPrice';
import { formatRelativeTime } from '@/utils/formatDate';

interface OfferCardProps {
  offer: OfferWithUser;
  onLike?: (offerId: string) => void;
  onDelete?: (offerId: string) => void;
  showActions?: boolean;
}

export default function OfferCard({
  offer,
  onLike,
  onDelete,
  showActions = true,
}: OfferCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <Link href={`/oferta/${offer.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/oferta/${offer.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition line-clamp-2">
            {offer.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-orange-600">
            {formatPrice(offer.price)}
          </span>
          {offer.source === 'scraper' && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Auto
            </span>
          )}
        </div>

        {/* Description */}
        {offer.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {offer.description}
          </p>
        )}

        {/* User Info */}
        {offer.user && (
          <div className="flex items-center space-x-2 mb-3 text-sm text-gray-500">
            {offer.user.avatar_url && (
              <Image
                src={offer.user.avatar_url}
                alt={offer.user.name || 'User'}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span>{offer.user.name || 'Usuario'}</span>
            <span>•</span>
            <span>{formatRelativeTime(offer.created_at)}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              {onLike && (
                <button
                  onClick={() => onLike(offer.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                >
                  <span className="text-xl">❤️</span>
                  <span className="text-sm">{offer.likes_count}</span>
                </button>
              )}
            </div>

            {/* Affiliate Link */}
            <a
              href={offer.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
            >
              Ver Oferta
            </a>
          </div>
        )}

        {/* Delete Button (for admin/owner) */}
        {onDelete && (
          <button
            onClick={() => onDelete(offer.id)}
            className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

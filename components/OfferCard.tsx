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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link href={`/oferta/${offer.id}`} className="sm:w-48 sm:flex-shrink-0">
          <div className="relative h-48 sm:h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-gray-50 dark:bg-gray-900">
          <div>
            {/* Header: User and Time */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {offer.user && (
                  <>
                    {offer.user.avatar_url ? (
                      <Image
                        src={offer.user.avatar_url}
                        alt={offer.user.name || 'User'}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                        {offer.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{offer.user.name || 'Usuario'}</span>
                    <span>•</span>
                  </>
                )}
                <span>{formatRelativeTime(offer.created_at)}</span>
                {offer.source === 'scraper' && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">Auto</span>
                )}
              </div>
            </div>

            {/* Title */}
            <Link href={`/oferta/${offer.id}`}>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-500 transition mb-2">
                {offer.title}
              </h3>
            </Link>

            {/* Description */}
            {offer.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {offer.description}
              </p>
            )}
          </div>

          {/* Footer: Price and Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4">
              {/* Price */}
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(offer.price)}
              </span>

              {/* Like Button */}
              {showActions && onLike && (
                <button
                  onClick={() => onLike(offer.id)}
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{offer.likes_count}</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={offer.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium w-full text-center"
              >
                Ver Oferta
              </a>
              {onDelete && (
                <button
                  onClick={() => onDelete(offer.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm w-full"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

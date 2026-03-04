'use client';

import { useOffers } from '@/hooks/useOffers';
import OfferCard from '@/components/OfferCard';
import Loading from '@/components/Loading';

export default function HomePage() {
  console.log('🏠 HomePage: Component rendered');
  const { offers, loading, toggleLike } = useOffers();

  console.log('🏠 HomePage: Offers count:', offers.length, 'Loading:', loading);

  if (loading) {
    console.log('⏳ HomePage: Still loading offers...');
    return <Loading />;
  }

  console.log('✅ HomePage: Rendering', offers.length, 'offers');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Offers Grid */}
      {offers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No hay ofertas disponibles en este momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onLike={toggleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}

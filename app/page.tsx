'use client';

import { useOffers } from '@/hooks/useOffers';
import OfferCard from '@/components/OfferCard';
import Loading from '@/components/Loading';

export default function HomePage() {
  const { offers, loading, toggleLike } = useOffers();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🔥 Los Mejores Ofertonazos del Momento
        </h1>
        <p className="text-lg text-gray-600">
          Descubre las mejores ofertas seleccionadas por la comunidad
        </p>
      </div>

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

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOffers } from '@/hooks/useOffers';
import OfferCard from '@/components/OfferCard';
import Loading from '@/components/Loading';
import { OFFER_CATEGORIES, OfferCategory } from '@/lib/categories';

const ALL_CATEGORIES = [
  { value: null as OfferCategory | null, label: 'Todas', emoji: '🔥' },
  ...OFFER_CATEGORIES.map((c) => ({ value: c.value as OfferCategory | null, label: c.label, emoji: c.emoji })),
];

function HomePageContent() {
  const searchParams = useSearchParams();
  const sort = (searchParams?.get('sort') as 'new' | 'top') === 'top' ? 'top' : 'new';
  const { offers, loading, toggleLike, likedOfferIds } = useOffers(sort);
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | null>(null);

  const filteredOffers = selectedCategory
    ? offers.filter((o) => o.category === selectedCategory)
    : offers;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">

      {/* Barra de 2 filas: categorías arriba, sort abajo */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">

        {/* Fila 1: Categorías como texto */}
        <div className="border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={String(cat.value)}
                onClick={() => setSelectedCategory(cat.value)}
                className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fila 2: Sort */}
        <div className="max-w-4xl mx-auto px-4 flex gap-0">
          <Link
            href="/?sort=new"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              sort === 'new'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-300'
            }`}
          >
            Nuevo
          </Link>
          <Link
            href="/?sort=top"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              sort === 'top'
                ? 'border-orange-500 text-orange-602 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-300'
            }`}
          >
            Más buscadaaas
          </Link>
        </div>

      </div>

      {/* Container with subtle side shadows */}
      <div className="flex justify-center flex-1">
        {/* Left shadow - full height */}
        <div className="hidden lg:block w-8 min-h-full bg-gradient-to-r from-transparent to-gray-200/50 dark:to-gray-800/50 shadow-[inset_-8px_0_8px_-8px_rgba(0,0,0,0.1)]"></div>
        
        {/* Main content */}
        <div className="flex-1 max-w-4xl py-6 px-4 bg-white/30 dark:bg-gray-800/30">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 transition-colors duration-300">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {sort === 'top' ? '🏆 Más Buscadas' : '🔥 Ofertas Recientes'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sort === 'top' ? 'Las ofertas con más likes de la comunidad' : 'Las mejores ofertas encontradas para ti'}
            </p>
          </div>

          {/* Offers List */}
          {filteredOffers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center transition-colors duration-300">
              <div className="text-6xl mb-4">{selectedCategory ? '🔍' : '📭'}</div>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {selectedCategory
                  ? 'No hay ofertas en esta categoría todavía'
                  : 'No hay ofertas disponibles en este momento'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isLiked={likedOfferIds.has(offer.id)}
                  onLike={toggleLike}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right shadow - full height */}
        <div className="hidden lg:block w-8 min-h-full bg-gradient-to-l from-transparent to-gray-200/50 dark:to-gray-800/50 shadow-[inset_8px_0_8px_-8px_rgba(0,0,0,0.1)]"></div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-orange-500">🔥 Ofertonazos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Las mejores ofertas en un solo lugar</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Inicio</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Categorías</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Contacto</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Términos</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Privacidad</a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2026 Ofertonazos. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePageContent />
    </Suspense>
  );
}

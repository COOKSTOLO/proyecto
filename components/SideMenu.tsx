'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { OFFER_CATEGORIES } from '@/lib/categories';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [storesOpen, setStoresOpen] = useState(true);
  const firstFocusRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      firstFocusRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed left-0 top-0 h-full w-72 z-50 bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-orange-600 text-white shrink-0">
          <Link
            ref={firstFocusRef}
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">Ofertonazos</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-orange-700 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav content */}
        <nav className="flex-1 overflow-y-auto">

          {/* Inicio */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium border-b border-gray-100 dark:border-gray-800"
          >
            <span className="w-6 text-center text-lg">🏠</span>
            <span>Inicio</span>
          </Link>

          {/* Gratis destacado */}
          <Link
            href="/?category=gratis"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-semibold border-b border-gray-100 dark:border-gray-800"
          >
            <span className="w-6 text-center text-lg">🆓</span>
            <span>Gratis</span>
            <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">NUEVO</span>
          </Link>

          {/* ── Categorías ── */}
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-900 dark:text-gray-100 font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
            aria-expanded={categoriesOpen}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-lg">🏷️</span>
              <span>Categorías</span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {categoriesOpen && (
            <div className="border-b border-gray-100 dark:border-gray-800">
              {OFFER_CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/?category=${cat.value}`}
                  onClick={onClose}
                  className="flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <span className="w-5 text-center">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* ── Tiendas ── */}
          <button
            onClick={() => setStoresOpen(!storesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-900 dark:text-gray-100 font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
            aria-expanded={storesOpen}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-lg">🏪</span>
              <span>Tiendas</span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${storesOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {storesOpen && (
            <div className="border-b border-gray-100 dark:border-gray-800 px-10 py-4 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <span>🚧</span>
              <span>Próximamente</span>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © 2026 Ofertonazos · Las mejores ofertas
          </p>
        </div>
      </div>
    </>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { formatPrice } from '@/utils/formatPrice';

export default function SearchBar() {
  const { query, setQuery, results, searching, clearSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Open/close dropdown based on query + results
  useEffect(() => {
    if (query.trim().length >= 2) setOpen(true);
    else setOpen(false);
    setActiveIndex(-1);
  }, [query, results]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      clearSearch();
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      router.push(`/oferta/${results[activeIndex].id}`);
      clearSearch();
      setOpen(false);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/oferta/${id}`);
    clearSearch();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-48 sm:w-72 md:w-96">
      {/* Input */}
      <div className="relative flex items-center">
        {/* Search / Spinner icon */}
        <span className="absolute left-3 pointer-events-none text-gray-400">
          {searching ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
          )}
        </span>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Buscar ofertas..."
          autoComplete="off"
          className="w-full pl-10 pr-9 py-2 text-base rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-orange-400 focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-colors"
          aria-label="Buscar ofertas"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { clearSearch(); inputRef.current?.focus(); }}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Limpiar búsqueda"
            tabIndex={-1}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {open && (
        <div
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[60] overflow-hidden max-h-80 overflow-y-auto"
        >
          {!searching && results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500 text-center">
              <span className="text-2xl block mb-1">🔍</span>
              Sin resultados para <strong className="text-gray-600 dark:text-gray-400">"{query}"</strong>
            </div>
          ) : (
            <ul>
              {results.map((offer, i) => (
                <li key={offer.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    onClick={() => handleSelect(offer.id)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0 transition-colors ${
                      i === activeIndex
                        ? 'bg-orange-50 dark:bg-orange-900/25'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {/* Thumbnail */}
                    {offer.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={offer.image_url}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 flex items-center justify-center text-lg">
                        🛍️
                      </div>
                    )}

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {offer.title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                          {formatPrice(offer.price)}
                        </span>
                        {offer.original_price && offer.original_price > offer.price && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                            {formatPrice(offer.original_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow hint */}
                    <svg
                      className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 text-[10px] text-gray-400 dark:text-gray-600 flex items-center gap-2">
              <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1">↑↓</kbd>
              navegar
              <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1">↵</kbd>
              abrir
              <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1">Esc</kbd>
              cerrar
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useCookieConsent } from '@/context/CookieConsentContext';

const CATEGORIES = [
  {
    key: 'analytics' as const,
    label: 'Analíticas',
    description:
      'Nos ayudan a entender cómo usas el sitio (páginas visitadas, tiempo de sesión). Usadas para mejorar el servicio.',
  },
  {
    key: 'marketing' as const,
    label: 'Publicidad',
    description:
      'Permiten mostrar anuncios relevantes para ti y medir la efectividad de las campañas publicitarias.',
  },
];

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Mover el foco al banner cuando aparece (accesibilidad)
  useEffect(() => {
    if (showBanner && dialogRef.current) {
      const first = dialogRef.current.querySelector<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }
  }, [showBanner, expanded]);

  if (!showBanner) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gestión de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
    >
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        {!expanded ? (
          /* Vista simple */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              🍪 Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y mostrar publicidad relevante.{' '}
              <a href="/politica-cookies" className="text-orange-600 hover:underline">
                Política de cookies
              </a>
            </p>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setExpanded(true)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Personalizar
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Solo necesarias
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors font-medium"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          /* Vista personalización */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Personalizar cookies
              </h2>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Volver a vista simple"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Categoría: necesarias — siempre activas */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Necesarias</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Imprescindibles para el funcionamiento del sitio (sesión, autenticación). No se pueden desactivar.
                </p>
              </div>
              <span className="text-xs font-medium text-orange-600 shrink-0 mt-1">Siempre activas</span>
            </div>

            {/* Categorías configurables */}
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs[cat.key]}
                  aria-label={`${cat.label} cookies`}
                  onClick={() => setPrefs((p) => ({ ...p, [cat.key]: !p[cat.key] }))}
                  className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 ${
                    prefs[cat.key] ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      prefs[cat.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="flex items-center justify-end gap-2 flex-wrap">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Solo necesarias
              </button>
              <button
                onClick={() => savePreferences(prefs)}
                className="px-4 py-2 text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors font-medium"
              >
                Guardar preferencias
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors font-medium"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

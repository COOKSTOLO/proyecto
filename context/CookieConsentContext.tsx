'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const CONSENT_KEY = 'cookie_consent_v2';
const CONSENT_VERSION = '1.0'; // Incrementar cuando cambie la política de cookies

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord {
  preferences: ConsentPreferences;
  timestamp: string;
  version: string;
}

interface CookieConsentContextType {
  consent: ConsentRecord | null;
  showBanner: boolean;
  hasConsent: (category: ConsentCategory) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Pick<ConsentPreferences, 'analytics' | 'marketing'>) => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (raw) {
        const parsed: ConsentRecord = JSON.parse(raw);
        // Si la versión cambió, el consentimiento anterior queda inválido
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed);
          return;
        }
      }
    } catch {
      // localStorage corrupto — mostrar banner de nuevo
    }
    setShowBanner(true);
  }, []);

  const save = useCallback((preferences: ConsentPreferences) => {
    const record: ConsentRecord = {
      preferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    setConsent(record);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    save({ necessary: true, analytics: true, marketing: true });
  }, [save]);

  const rejectAll = useCallback(() => {
    save({ necessary: true, analytics: false, marketing: false });
  }, [save]);

  const savePreferences = useCallback(
    (prefs: Pick<ConsentPreferences, 'analytics' | 'marketing'>) => {
      save({ necessary: true, ...prefs });
    },
    [save]
  );

  // Llamar desde el footer: "Gestionar cookies"
  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  }, []);

  const hasConsent = useCallback(
    (category: ConsentCategory): boolean => {
      if (category === 'necessary') return true;
      return consent?.preferences[category] ?? false;
    },
    [consent]
  );

  // Evitar hydration mismatch: renderizar children siempre, banner solo client-side
  return (
    <CookieConsentContext.Provider
      value={{ consent, showBanner: mounted && showBanner, hasConsent, acceptAll, rejectAll, savePreferences, resetConsent }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

export const OFFER_CATEGORIES = [
  { value: 'tecnologia',   label: 'Tecnología',      emoji: '💻' },
  { value: 'hogar',        label: 'Hogar',            emoji: '🏠' },
  { value: 'moda',         label: 'Moda & Ropa',      emoji: '👗' },
  { value: 'alimentacion', label: 'Alimentación',     emoji: '🍔' },
  { value: 'viajes',       label: 'Viajes',           emoji: '✈️' },
  { value: 'deportes',     label: 'Deportes',         emoji: '⚽' },
  { value: 'salud',        label: 'Salud & Belleza',  emoji: '💊' },
  { value: 'otros',        label: 'Otros',            emoji: '🎁' },
] as const;

export type OfferCategory = typeof OFFER_CATEGORIES[number]['value'];

export function getCategoryInfo(value: string | null | undefined) {
  return OFFER_CATEGORIES.find((c) => c.value === value) ?? null;
}

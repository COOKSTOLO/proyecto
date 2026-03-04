/**
 * Formatea un precio a formato de moneda española
 * @param price Precio en número
 * @returns Precio formateado (ej: 29,99 €)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Formatea un precio para mostrar de forma más compacta
 * @param price Precio en número
 * @returns Precio formateado compacto
 */
export function formatPriceCompact(price: number): string {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}k €`;
  }
  return formatPrice(price);
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida si un precio es válido
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0 && isFinite(price);
}

/**
 * Valida los datos de una nueva oferta
 */
export function validateOfferData(data: {
  title: string;
  price: number;
  image_url: string;
  affiliate_link: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }

  if (!isValidPrice(data.price)) {
    errors.push('El precio debe ser un número válido mayor que 0');
  }

  if (!isValidUrl(data.image_url)) {
    errors.push('La URL de la imagen no es válida');
  }

  if (!isValidUrl(data.affiliate_link)) {
    errors.push('El link de afiliado no es válido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

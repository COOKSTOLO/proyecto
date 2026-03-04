'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';
import ProtectedRoute from '@/components/ProtectedRoute';
import { validateOfferData } from '@/utils/validators';

export default function CreateOfferPage() {
  const { user, canCreateOffers } = useAuth();
  const { createOffer } = useOffers();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image_url: '',
    description: '',
    affiliate_link: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateOfferData({
      title: formData.title,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      affiliate_link: formData.affiliate_link,
    });

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    if (!canCreateOffers) {
      setError('No tienes permiso para crear ofertas. Necesitas una suscripción activa.');
      return;
    }

    setLoading(true);

    try {
      await createOffer({
        title: formData.title,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        description: formData.description || undefined,
        affiliate_link: formData.affiliate_link,
      });

      router.push('/');
    } catch (err) {
      setError('Error al crear la oferta. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔥 Crear Nueva Oferta
        </h1>

        {!canCreateOffers && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ Necesitas una suscripción activa para publicar ofertas.
              Contacta con un administrador.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título de la oferta *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="Ej: iPhone 15 Pro Max 256GB"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio (€) *
            </label>
            <input
              type="number"
              id="price"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="29.99"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la imagen *
            </label>
            <input
              type="url"
              id="image_url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="Describe la oferta..."
            />
          </div>

          {/* Affiliate Link */}
          <div>
            <label htmlFor="affiliate_link" className="block text-sm font-medium text-gray-700 mb-2">
              Link de afiliado *
            </label>
            <input
              type="url"
              id="affiliate_link"
              required
              value={formData.affiliate_link}
              onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="https://amazon.es/..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !canCreateOffers}
            className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando...' : 'Publicar Oferta'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

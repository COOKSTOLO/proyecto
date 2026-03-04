'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';
import ProtectedRoute from '@/components/ProtectedRoute';
import { validateOfferData } from '@/utils/validators';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function CreateOfferPage() {
  console.log('🎨 CreateOfferPage: Component mounted');
  const { user, canCreateOffers } = useAuth();
  console.log('🎨 CreateOfferPage: User:', user?.email, 'Can create:', canCreateOffers);
  const { createOffer } = useOffers();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image_url: '',
    description: '',
    affiliate_link: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📷 Image file selected');
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📷 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    // Validar tamaño máximo 1MB
    const maxSize = 1 * 1024 * 1024; // 1MB en bytes
    if (file.size > maxSize) {
      console.log('❌ Image too large');
      setError('La imagen debe ser menor a 1 MB');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    setImageFile(file);
    setError(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    console.log('📤 Starting image upload...');
    if (!imageFile || !user) throw new Error('No hay imagen o usuario');

    setUploadingImage(true);

    try {
      // Generar nombre único para la imagen
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `offers/${fileName}`;
      console.log('📤 Uploading to:', filePath);

      // Subir imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Image uploaded successfully');
      // Obtener URL pública
      const { data } = supabase.storage
        .from('offer-images')
        .getPublicUrl(filePath);

      console.log('✅ Public URL:', data.publicUrl);
      return data.publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    setError(null);

    // Si hay archivo de imagen, subirlo primero
    let finalImageUrl = formData.image_url;
    
    if (imageFile) {
      console.log('📤 Need to upload image first');
      try {
        finalImageUrl = await uploadImage();
      } catch (err) {
        setError('Error al subir la imagen. Inténtalo de nuevo.');
        console.error(err);
        return;
      }
    }

    // Validar
    const validation = validateOfferData({
      title: formData.title,
      price: parseFloat(formData.price),
      image_url: finalImageUrl,
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
    console.log('✨ Creating offer...');

    try {
      await createOffer({
        title: formData.title,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
        description: formData.description || undefined,
        affiliate_link: formData.affiliate_link,
      });

      console.log('✅ Offer created successfully!');
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

          {/* Image Upload or URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto *
            </label>
            
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label
                  htmlFor="image_file"
                  className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 cursor-pointer transition text-center"
                >
                  <span className="text-gray-600">
                    📷 Subir imagen (máx. 1 MB)
                  </span>
                  <input
                    type="file"
                    id="image_file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O usa una URL</span>
                </div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                id="image_url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImageFile(null);
                  setImagePreview('');
                }}
                disabled={!!imageFile}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent disabled:bg-gray-100"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
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
            disabled={loading || uploadingImage || !canCreateOffers}
            className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadingImage ? 'Subiendo imagen...' : loading ? 'Publicando...' : 'Publicar Oferta'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';
import ProtectedRoute from '@/components/ProtectedRoute';
import { validateOfferData } from '@/utils/validators';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewImage = imagePreview || formData.image_url || null;
  const previewPrice = formData.price ? parseFloat(formData.price) : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { setError('La imagen debe ser menor a 1 MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Solo se permiten archivos de imagen'); return; }
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !user) throw new Error('No hay imagen o usuario');
    setUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `offers/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('offer-images').getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let finalImageUrl = formData.image_url;
    if (imageFile) {
      try { finalImageUrl = await uploadImage(); }
      catch (err) { setError('Error al subir la imagen. Inténtalo de nuevo.'); console.error(err); return; }
    }
    const validation = validateOfferData({
      title: formData.title,
      price: parseFloat(formData.price),
      image_url: finalImageUrl,
      affiliate_link: formData.affiliate_link,
    });
    if (!validation.valid) { setError(validation.errors.join(', ')); return; }
    if (!canCreateOffers) { setError('No tienes permiso para crear ofertas. Necesitas una suscripción activa.'); return; }
    setLoading(true);
    try {
      await createOffer({
        title: formData.title,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
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

  const fieldCls = 'w-full bg-transparent border-none outline-none focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500';

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 pt-4 pb-8 flex-1">

          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            ← Volver al feed
          </Link>

          {!canCreateOffers && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4 text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Necesitas una suscripción activa para publicar ofertas. Contacta con un administrador.
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4 text-sm text-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Same wrapper as OfferDetailClient */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_24px_rgba(255,255,255,0.05)] overflow-hidden max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 p-8">

                {/* Image — same h-96, click to upload */}
                <label htmlFor="image_file" className="cursor-pointer group">
                  <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {previewImage ? (
                      <>
                        <Image
                          src={previewImage}
                          alt="preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">📷 Cambiar imagen</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors">
                        <span className="text-5xl">📷</span>
                        <span className="text-sm font-medium">Haz clic para subir imagen</span>
                        <span className="text-xs opacity-70">máx. 1 MB</span>
                      </div>
                    )}
                  </div>
                  <input type="file" id="image_file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {/* URL fallback */}
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => { setFormData({ ...formData, image_url: e.target.value }); setImageFile(null); setImagePreview(''); }}
                    disabled={!!imageFile}
                    placeholder="O pega una URL de imagen..."
                    onClick={(e) => e.preventDefault()}
                    className="mt-2 w-full bg-transparent text-xs text-gray-400 dark:text-gray-600 placeholder-gray-300 dark:placeholder-gray-700 border-none outline-none disabled:opacity-40"
                  />
                </label>

                {/* Details — same flex flex-col layout */}
                <div className="flex flex-col">

                  {/* Title — editable, same text-3xl font-bold */}
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título de la oferta..."
                    className={`${fieldCls} text-3xl font-bold text-gray-900 dark:text-white mb-4`}
                  />

                  {/* Price — editable, same text-4xl font-bold text-orange-600 */}
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0,00 €"
                    className={`${fieldCls} text-4xl font-bold text-orange-600 dark:text-orange-500 mb-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />

                  {/* Description — editable */}
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la oferta (opcional)..."
                    className={`${fieldCls} text-gray-700 dark:text-gray-300 mb-6`}
                  />

                  {/* User Info — static, same box */}
                  <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.email?.split('@')[0] || 'Usuario'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Publicado hace un momento
                      </p>
                    </div>
                  </div>

                  {/* Additional info — same spacing */}
                  <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <p>❤️ 0 me gusta</p>
                    <p>📦 Fuente: Manual</p>
                  </div>

                  {/* Actions — affiliate link input styled as Ver Oferta + submit */}
                  <div className="space-y-3 mt-auto">
                    {/* Affiliate link — editable, looks like Ver Oferta button */}
                    <input
                      type="url"
                      required
                      value={formData.affiliate_link}
                      onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                      placeholder="Link de afiliado (https://amazon.es/...)"
                      className="block w-full px-6 py-3 bg-orange-600 text-white text-center rounded-lg font-medium placeholder-orange-200 dark:placeholder-orange-300 border-none outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    {/* Submit = Publicar Oferta */}
                    <button
                      type="submit"
                      disabled={loading || uploadingImage || !canCreateOffers}
                      className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? '⏳ Subiendo imagen...' : loading ? '⏳ Publicando...' : '🔥 Publicar Oferta'}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </ProtectedRoute>
  );
}


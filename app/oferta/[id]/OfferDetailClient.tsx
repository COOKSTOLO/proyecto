'use client';

import Image from 'next/image';
import Link from 'next/link';
import { OfferWithUser } from '@/types/offer';
import { formatPrice } from '@/utils/formatPrice';
import { formatRelativeTime } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    name: string | null;
    avatar_url: string | null;
  } | null;
}

interface OfferDetailClientProps {
  offer: OfferWithUser;
}

export default function OfferDetailClient({ offer }: OfferDetailClientProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id, user:profiles(name, avatar_url)')
        .eq('offer_id', offer.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data as unknown as Comment[]);
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [offer.id]);

  // Submit comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({ offer_id: offer.id, user_id: user.id, content: newComment.trim() })
      .select('id, content, created_at, user_id, user:profiles(name, avatar_url)')
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as unknown as Comment]);
      setNewComment('');
    }
    setSubmitting(false);
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  // Delete offer
  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) return;
    try {
      const { error } = await supabase.from('offers').delete().eq('id', offer.id);
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error al eliminar la oferta');
    }
  };

  const canDelete = user && (user.id === offer.user_id || isAdmin);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 pt-4 pb-8 flex-1">
      <Link
        href="/"
        className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
      >
        ← Volver al feed
      </Link>

      {/* Offer + Comments — single box */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_24px_rgba(255,255,255,0.05)] overflow-hidden max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {offer.title}
            </h1>

            <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-6">
              {formatPrice(offer.price)}
            </div>

            {offer.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-6">{offer.description}</p>
            )}

            {/* User Info */}
            {offer.user && (
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {offer.user.avatar_url && (
                  <Image
                    src={offer.user.avatar_url}
                    alt={offer.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {offer.user.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Publicado {formatRelativeTime(offer.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <p>❤️ {offer.likes_count} me gusta</p>
              <p>📦 Fuente: {offer.source === 'scraper' ? 'Automática' : 'Manual'}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <a
                href={offer.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-orange-600 text-white text-center rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Ver Oferta 🔥
              </a>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="block w-full px-6 py-3 bg-red-500 text-white text-center rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Eliminar Oferta
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Comments section */}
        <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💬 Comentarios ({comments.length})
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              maxLength={1000}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{newComment.length}/1000</span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>
        ) : (
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-orange-600 hover:underline">Inicia sesión</Link> para dejar un comentario.
          </p>
        )}

        {/* Comments list */}
        {loadingComments ? (
          <p className="text-sm text-gray-400">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Sé el primero en comentar.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                {/* Avatar */}
                {comment.user?.avatar_url ? (
                  <Image
                    src={comment.user.avatar_url}
                    alt={comment.user.name || 'User'}
                    width={36}
                    height={36}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                    {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {comment.user?.name || 'Usuario'}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    {comment.content}
                  </p>
                </div>

                {/* Delete button */}
                {user && (user.id === comment.user_id || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition flex-shrink-0 self-start"
                    title="Eliminar comentario"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-orange-500">🔥 Ofertonazos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Las mejores ofertas en un solo lugar</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Inicio</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Categorías</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Contacto</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Términos</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Privacidad</a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2026 Ofertonazos. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

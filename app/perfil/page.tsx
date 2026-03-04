'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, signOut, isAdmin, hasSubscription } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Avatar and Name */}
          <div className="flex items-center space-x-4 mb-6">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name || 'User'}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <label className="text-sm text-gray-500">Rol</label>
              <p className="text-lg font-medium text-gray-900">
                {isAdmin ? '👑 Administrador' : '👤 Usuario'}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Suscripción</label>
              <p className="text-lg font-medium text-gray-900">
                {hasSubscription ? (
                  <span className="text-green-600">✅ Activa</span>
                ) : (
                  <span className="text-red-600">❌ Inactiva</span>
                )}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Puede publicar ofertas</label>
              <p className="text-lg font-medium text-gray-900">
                {isAdmin || hasSubscription ? (
                  <span className="text-green-600">✅ Sí</span>
                ) : (
                  <span className="text-red-600">❌ No</span>
                )}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Miembro desde</label>
              <p className="text-lg font-medium text-gray-900">
                {new Date(user.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t space-y-3">
            <button
              onClick={signOut}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

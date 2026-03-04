'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">🔥</span>
            <span className="text-xl font-bold text-gray-900">Ofertonazos</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-orange-600 transition"
                    >
                      Feed
                    </Link>
                    <Link
                      href="/crear"
                      className="text-gray-700 hover:text-orange-600 transition"
                    >
                      Crear Oferta
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="text-gray-700 hover:text-orange-600 transition"
                      >
                        Admin
                      </Link>
                    )}
                    
                    {/* User Menu */}
                    <div className="flex items-center space-x-3">
                      <Link href="/perfil" className="flex items-center space-x-2">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {user.name}
                        </span>
                      </Link>
                      <button
                        onClick={signOut}
                        className="text-sm text-gray-600 hover:text-orange-600 transition"
                      >
                        Salir
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SideMenu from '@/components/SideMenu';
import SearchBar from '@/components/SearchBar';

export default function Navbar() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleAdminClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      alert('No tienes permisos para acceder al panel de administración.');
    }
  };

  return (
    <>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 gap-5">
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Abrir menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-orange-600">🔥</span>
                <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">Ofertonazos</span>
              </Link>
            </div>

            {/* Search bar */}
            <SearchBar />

          {/* Navigation Links */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/crear"
                      className="px-3 py-1.5 mx-3 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                    >
                      + Crear Oferta
                    </Link>
                    {/* User Menu */}
                    <div className="flex items-center space-x-5">
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.name}
                        </span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition"
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
    </>
  );
}






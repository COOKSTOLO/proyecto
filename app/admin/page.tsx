'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { User } from '@/types/user';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookiesFile, setCookiesFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [scraperStatus, setScraperStatus] = useState('inactive');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message || 'An unknown error occurred');
        return;
      }

      setUsers((data as User[]) || []);
    } catch (error) {
      setError('An unexpected error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_active: !currentStatus })
        .eq('id', userId);

      fetchUsers();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      fetchUsers();
    } catch (error) {
      console.error('Error updating admin role:', error);
    }
  };

  const handleCookiesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setCookiesFile(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/uploadCookies', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Cookies uploaded successfully');
        } else {
          alert('Failed to upload cookies');
        }
      } catch (error) {
        console.error('Error uploading cookies:', error);
      }
    }
  };

  const handleJsonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setJsonFile(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/uploadJson', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('JSON uploaded successfully');
        } else {
          alert('Failed to upload JSON');
        }
      } catch (error) {
        console.error('Error uploading JSON:', error);
      }
    }
  };

  const handleStartScraper = async () => {
    try {
      const response = await fetch('/api/scraperControl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      if (response.ok) {
        setScraperStatus('active');
        alert('Scraper started');
      } else {
        alert('Failed to start scraper');
      }
    } catch (error) {
      console.error('Error starting scraper:', error);
    }
  };

  const handleStopScraper = async () => {
    try {
      const response = await fetch('/api/scraperControl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });

      if (response.ok) {
        setScraperStatus('inactive');
        alert('Scraper stopped');
      } else {
        alert('Failed to stop scraper');
      }
    } catch (error) {
      console.error('Error stopping scraper:', error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Panel de Administración</h1>

          {/* Scraper Configuration Card */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración del Scraper
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const scrapingInterval = formData.get('scrapingInterval');

                try {
                  const response = await fetch('/api/scraperControl', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'configure', scrapingInterval }),
                  });

                  if (response.ok) {
                    alert('Configuración actualizada');
                  } else {
                    alert('Error al actualizar configuración');
                  }
                } catch (error) {
                  console.error('Error:', error);
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* JSON Upload */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subir JSON de Enlaces
                  </label>
                  <input
                    type="file"
                    name="jsonLinks"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                  />
                  {jsonFile && <p className="mt-2 text-xs text-green-400">✓ {jsonFile.name}</p>}
                </div>

                {/* Cookies Upload */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subir Cookies
                  </label>
                  <input
                    type="file"
                    name="cookies"
                    accept=".json,.txt"
                    onChange={handleCookiesUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                  />
                  {cookiesFile && <p className="mt-2 text-xs text-green-400">✓ {cookiesFile.name}</p>}
                </div>
              </div>

              {/* Scraping Interval */}
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Intervalo de Scraping (minutos)
                </label>
                <input
                  type="number"
                  name="scrapingInterval"
                  min="1"
                  defaultValue={30}
                  required
                  className="w-full md:w-48 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Status and Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${scraperStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  <span className="text-sm text-gray-300">
                    Estado: {scraperStatus === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleStartScraper}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Iniciar Scraper
                  </button>
                  <button
                    type="button"
                    onClick={handleStopScraper}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Detener Scraper
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Users Management Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Gestión de Usuarios ({users.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                Error: {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Suscripción</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="text-white font-medium">{user.name || 'Sin nombre'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">{user.email || 'Sin email'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-900 text-purple-200' 
                              : 'bg-gray-600 text-gray-200'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.subscription_active 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-red-900 text-red-200'
                          }`}>
                            {user.subscription_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleSubscription(user.id, user.subscription_active)}
                              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                                user.subscription_active
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {user.subscription_active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => toggleAdmin(user.id, user.role)}
                              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                                user.role === 'admin'
                                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

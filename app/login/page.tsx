'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, loading } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, name);
        setSuccess('Cuenta creada. Revisa tu correo para confirmar tu cuenta.');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
          </h2>
          <p className="text-gray-400">
            {isRegister ? 'Regístrate para compartir ofertas' : 'Inicia sesión para descubrir ofertas'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => { setIsRegister(false); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              !isRegister ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              isRegister ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </span>
            ) : (
              isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">O continúa con</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-white font-medium">Google</span>
        </button>

        <div className="text-center text-xs text-gray-500">
          Al continuar, aceptas nuestros términos y condiciones
        </div>
      </div>
    </div>
  );
}

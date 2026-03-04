export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  subscription_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  // Puedes agregar campos adicionales aquí
}

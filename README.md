# 🔥 Ofertonazos

**La plataforma definitiva para descubrir y compartir las mejores ofertas.**

Ofertonazos es una aplicación web moderna construida con Next.js, TypeScript, TailwindCSS y Supabase. Permite a los usuarios descubrir ofertas increíbles, publicar sus propios descubrimientos y participar en una comunidad activa de cazadores de chollos.

---

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 19**

### Backend
- **Supabase**
  - PostgreSQL Database
  - Authentication (Google OAuth)
  - Storage
  - Realtime
  - Row Level Security (RLS)

### Deploy
- **Vercel** (recomendado)

---

## 📂 Estructura del Proyecto

```
ofertonazos/
├── app/                    # Pages (Next.js App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Home (feed de ofertas)
│   ├── login/             # Página de login
│   ├── crear/             # Crear nueva oferta
│   ├── admin/             # Panel de administración
│   ├── perfil/            # Perfil de usuario
│   ├── oferta/[id]/       # Detalle de oferta
│   └── auth/callback/     # Callback de autenticación
│
├── components/            # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── OfferCard.tsx
│   ├── ProtectedRoute.tsx
│   ├── AdminGuard.tsx
│   └── Loading.tsx
│
├── lib/                   # Configuración de librerías
│   ├── supabaseClient.ts  # Cliente de Supabase (client-side)
│   └── supabaseServer.ts  # Cliente de Supabase (server-side)
│
├── hooks/                 # Custom React Hooks
│   ├── useAuth.ts         # Hook de autenticación
│   └── useOffers.ts       # Hook de ofertas
│
├── types/                 # TypeScript types
│   ├── database.ts        # Tipos de base de datos
│   ├── user.ts           # Tipos de usuario
│   └── offer.ts          # Tipos de ofertas
│
├── utils/                 # Utilidades
│   ├── formatPrice.ts
│   ├── formatDate.ts
│   └── validators.ts
│
├── middleware.ts          # Middleware de Next.js (auth)
├── supabase-schema.sql    # Schema de base de datos
├── supabase-queries.sql   # Queries útiles
└── .env.local            # Variables de entorno
```

---

## 🏗️ Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd ofertonazos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### A. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales (URL y Anon Key)

#### B. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

#### C. Configurar la base de datos

1. En tu dashboard de Supabase, ve a **SQL Editor**
2. Ejecuta el contenido del archivo `supabase-schema.sql`
3. Esto creará todas las tablas, policies y triggers necesarios

#### D. Configurar Google OAuth

1. En Supabase Dashboard → **Authentication** → **Providers**
2. Habilita **Google**
3. Configura las credenciales de Google OAuth:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto
   - Habilita Google+ API
   - Crea credenciales OAuth 2.0
   - Agrega las URLs de callback autorizadas:
     - `https://your-supabase-url.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (para desarrollo)
   - Copia Client ID y Client Secret en Supabase

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Base de Datos

### Tablas

#### `profiles`
Extiende la tabla de usuarios de Supabase con información adicional.

- `id` (UUID) - Primary Key, referencia a auth.users
- `name` (text) - Nombre del usuario
- `email` (text) - Email
- `avatar_url` (text) - URL del avatar
- `role` ('user' | 'admin') - Rol del usuario
- `subscription_active` (boolean) - Estado de suscripción
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `offers`
Tabla principal de ofertas.

- `id` (UUID) - Primary Key
- `title` (text) - Título de la oferta
- `price` (numeric) - Precio
- `image_url` (text) - URL de la imagen
- `description` (text) - Descripción
- `affiliate_link` (text) - Link de afiliado
- `user_id` (UUID) - ID del usuario que publicó
- `likes_count` (integer) - Contador de likes
- `source` ('manual' | 'scraper') - Origen de la oferta
- `status` ('active' | 'inactive' | 'pending') - Estado
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `likes`
Tabla de likes (M:N entre usuarios y ofertas).

- `user_id` (UUID) - ID del usuario
- `offer_id` (UUID) - ID de la oferta
- `created_at` (timestamp)

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitada con políticas específicas:

- **Usuarios**: Pueden ver todos los perfiles, pero solo editar el suyo
- **Ofertas**: 
  - Todos pueden ver ofertas activas
  - Solo usuarios con suscripción activa o admins pueden crear
  - Solo el creador o admins pueden editar/eliminar
- **Likes**: Usuarios autenticados pueden dar/quitar like

---

## 🔑 Roles y Permisos

### Usuario Regular (`user`)
- ✅ Ver ofertas
- ✅ Dar likes
- ❌ Crear ofertas (requiere suscripción)

### Usuario con Suscripción
- ✅ Ver ofertas
- ✅ Dar likes
- ✅ Crear ofertas
- ✅ Editar sus propias ofertas
- ✅ Eliminar sus propias ofertas

### Administrador (`admin`)
- ✅ Todo lo anterior
- ✅ Panel de administración
- ✅ Activar/desactivar suscripciones
- ✅ Promover usuarios a admin
- ✅ Editar/eliminar cualquier oferta

### Activar usuarios

Para hacer a un usuario admin o activar su suscripción, usa las queries en `supabase-queries.sql`:

```sql
-- Hacer admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu-email@gmail.com';

-- Activar suscripción
UPDATE profiles
SET subscription_active = true
WHERE email = 'usuario@gmail.com';
```

---

## 🎨 Características

### ✅ Implementado

- **Autenticación con Google**: Login seguro mediante OAuth
- **Feed de ofertas en tiempo real**: Actualización automática con Supabase Realtime
- **Crear ofertas**: Formulario completo con validación
- **Sistema de likes**: Like/unlike con contador en tiempo real
- **Panel de administración**: Gestión de usuarios y permisos
- **Perfil de usuario**: Vista de información personal
- **Detalle de oferta**: Vista individual con toda la información
- **Row Level Security**: Seguridad a nivel de base de datos
- **Responsive design**: Funciona en todos los dispositivos

### 🚧 Próximamente

- **Sistema de comentarios**: Discusiones en cada oferta
- **Ranking "hot"**: Algoritmo para ofertas destacadas
- **Notificaciones**: Alertas de nuevas ofertas
- **Scraping automático**: Importación automática desde Amazon, AliExpress, etc.
- **Integración con Stripe**: Pagos de suscripciones
- **Categorías**: Organización de ofertas por categorías
- **Búsqueda y filtros**: Encontrar ofertas específicas
- **Sistema de puntos**: Gamificación

---

## 🚀 Deploy en Vercel

### 1. Conectar con GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy 🚀

### 3. Configurar callback URL en Supabase

Una vez deployado, agrega la URL de Vercel en:
- Supabase Dashboard → Authentication → URL Configuration
- Site URL: `https://tu-app.vercel.app`
- Redirect URLs: `https://tu-app.vercel.app/auth/callback`

---

## 📱 API Routes (Future)

Para integrar scraping automático:

```typescript
// app/api/scraper/route.ts
export async function POST(request: Request) {
  const { title, price, image_url, affiliate_link } = await request.json();
  
  // Validar API key
  // Insertar oferta con source: 'scraper'
  
  return Response.json({ success: true });
}
```

---

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter de código
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

## 📞 Contacto

Para consultas, sugerencias o colaboraciones, contacta a través de:
- GitHub Issues
- Email: [tu-email@ejemplo.com]

---

**¡Feliz caza de ofertas! 🔥**



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



## 📂 Estructura del Proyecto

```
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


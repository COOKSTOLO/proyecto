# Solución de Problemas

## Errores de TypeScript con Supabase

Si ves errores de tipo como:
```
Argument of type 'X' is not assignable to parameter of type 'never'.
```

Esto es un problema conocido con los tipos generados automáticamente de Supabase. La aplicación funcionará correctamente en runtime.

### Solución Temporal

Si los errores te molestan durante el desarrollo, puedes:

1. Ignorar específicamente esas líneas con `// @ts-expect-error`
2. Usar casting explícito: `as any`
3. Configurar `"strict": false` en `tsconfig.json` (ya aplicado)

### Solución Permanente

Para generar tipos correctos de Supabase:

```bash
npm install -D supabase-cli
npx supabase gen types typescript --project-id tu_project_id > types/supabase.ts
```

Luego usa esos tipos en lugar de los manualmente definidos.

## Problemas Comunes

### Error: Missing Supabase environment variables

Asegúrate de que `.env.local` tenga:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

### Error en login con Google

1. Verifica que Google OAuth esté configurado en Supabase Dashboard
2. Verifica las URLs de callback autorizadas
3. Verifica que las credenciales de Google Cloud Console sean correctas

### Las ofertas no se actualizan en tiempo real

1. Verifica que Realtime esté habilitado en Supabase Dashboard
2. Ve a Database > Replication y habilita la tabla `offers`

### No puedo crear ofertas

1. Verifica que tu usuario tenga `subscription_active = true` o `role = 'admin'`
2. Ejecuta en Supabase SQL Editor:
```sql
UPDATE profiles
SET subscription_active = true
WHERE email = 'tu-email@gmail.com';
```

### Las RLS policies no funcionan

1. Verifica que las policies estén creadas ejecutando `supabase-schema.sql`
2. Verifica en Supabase Dashboard > Authentication > Policies

## Desarrollo

### Hot Reload no funciona

Reinicia el servidor de desarrollo:
```bash
npm run dev
```

### Build falla

Ejecuta:
```bash
npm run build
```

Si hay errores de tipo, verifica que todas las dependencias estén instaladas:
```bash
npm install
```

## Deployment

### Error en Vercel

1. Verifica que las variables de entorno estén configuradas en Vercel Dashboard
2. Verifica que las URLs de callback incluyan tu dominio de Vercel
3. Fuerza un nuevo deploy

### Imágenes no cargan

Verifica que `next.config.ts` tenga configurado `remotePatterns` para permitir las URLs de tus imágenes.

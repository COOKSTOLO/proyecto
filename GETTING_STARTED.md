# 🚀 Próximos Pasos - Ofertonazos

Esta guía te ayudará a poner en marcha Ofertonazos paso a paso.

---

## ✅ Fase 1: Configuración Inicial (10 min)

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta si no la tienes
3. Crea un nuevo proyecto:
   - Nombre: `ofertonazos`
   - Database Password: **guárdala bien**
   - Region: Selecciona la más cercana

### 2. Configurar variables de entorno
1. Mientras esperas que Supabase termine de crear el proyecto, copia tus credenciales:
   - Ve a **Settings** → **API**
   - Copia `Project URL` y `anon public key`

2. Edita `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aqui
```

### 3. Configurar la base de datos
1. En Supabase Dashboard, ve a **SQL Editor**
2. Abre el archivo `supabase-schema.sql` de este proyecto
3. Copia **TODO** el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Verifica que no haya errores (debería decir "Success")

### 4. Configurar Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Haz clic en **Create Credentials** → **OAuth client ID**
5. Tipo de aplicación: **Web application**
6. Nombre: `Ofertonazos`
7. Authorized redirect URIs:
   ```
   https://tu-proyecto.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
8. Copia el **Client ID** y **Client Secret**

9. En Supabase Dashboard:
   - Ve a **Authentication** → **Providers**
   - Habilita **Google**
   - Pega el Client ID y Client Secret
   - Guarda

---

## ✅ Fase 2: Primer Arranque (5 min)

### 1. Instalar dependencias (si no lo hiciste aún)
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Abrir en el navegador
Ve a: [http://localhost:3000](http://localhost:3000)

### 4. Probar login
1. Haz clic en **"Iniciar Sesión"**
2. Selecciona **"Continuar con Google"**
3. Autoriza la aplicación
4. Deberías ser redirigido a la home page

---

## ✅ Fase 3: Convertirte en Admin (2 min)

### 1. Obtener tu email de usuario
Ya iniciaste sesión, ahora necesitas hacer tu usuario admin.

### 2. Ejecutar query SQL
1. En Supabase Dashboard, ve a **SQL Editor**
2. Crea una nueva query
3. Ejecuta:
```sql
-- Reemplaza con tu email
UPDATE profiles
SET role = 'admin', subscription_active = true
WHERE email = 'tu-email@gmail.com';
```

### 3. Refrescar la página
Recarga [http://localhost:3000](http://localhost:3000)

Ahora deberías ver el link **"Admin"** en la navegación.

---

## ✅ Fase 4: Prueba Completa (10 min)

### 1. Crear primera oferta
1. Ve a **"Crear Oferta"**
2. Llena el formulario:
   - **Título**: iPhone 15 Pro Max 256GB Negro
   - **Precio**: 999.99
   - **URL Imagen**: `https://m.media-amazon.com/images/I/81SigpJN1KL._AC_SX679_.jpg`
   - **Descripción**: Oferta increíble en Amazon
   - **Link afiliado**: `https://amazon.es/...`
3. Haz clic en **"Publicar Oferta"**

### 2. Ver la oferta en el feed
Deberías ver tu oferta aparecer automáticamente en la home page.

### 3. Dar like
Haz clic en el corazón ❤️ para probar el sistema de likes.

### 4. Ver detalle
Haz clic en la oferta para ver la página de detalle.

### 5. Probar panel admin
1. Ve a **"Admin"**
2. Verás la lista de usuarios
3. Prueba activar/desactivar suscripciones

---

## ✅ Fase 5: Habilitar Realtime (5 min)

Para que las ofertas aparezcan automáticamente sin recargar:

### 1. Habilitar Realtime en Supabase
1. Ve a **Database** → **Replication**
2. Busca la tabla `offers`
3. Activa el switch para habilitar Realtime
4. Haz lo mismo con `likes` y `profiles`

### 2. Probar
Abre dos ventanas del navegador lado a lado, crea una oferta en una y debería aparecer automáticamente en la otra.

---

## 🚀 Fase 6: Deploy a Producción (15 min)

### 1. Push a GitHub
```bash
git add .
git commit -m "Initial Ofertonazos setup"
git push origin main
```

### 2. Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**

### 3. Actualizar URLs de callback
Una vez deployado, copia tu URL de Vercel y agrega:

**En Google Cloud Console:**
- Authorized redirect URIs: `https://tu-app.vercel.app/auth/callback`

**En Supabase Dashboard:**
- Authentication → URL Configuration
- Site URL: `https://tu-app.vercel.app`
- Redirect URLs: `https://tu-app.vercel.app/auth/callback`

### 4. Probar en producción
Ve a tu URL de Vercel y prueba el login.

---

## 🎯 Fase 7: Siguientes Mejoras (Futuro)

Una vez tengas todo funcionando, aquí están las mejoras recomendadas:

### Corto Plazo (1-2 semanas)
- [ ] Añadir categorías a las ofertas
- [ ] Implementar sistema de búsqueda
- [ ] Añadir filtros (precio, fecha, categoría)
- [ ] Mejorar el diseño mobile
- [ ] Añadir imágenes de placeholder
- [ ] Sistema de notificaciones

### Medio Plazo (1 mes)
- [ ] Sistema de comentarios
- [ ] Ranking "hot" con algoritmo
- [ ] Sistema de puntos/karma
- [ ] Perfil de usuario mejorado
- [ ] Sistema de reportes
- [ ] Moderación de contenido

### Largo Plazo (2-3 meses)
- [ ] Scraping automático (Amazon, AliExpress)
- [ ] Integración con Stripe para pagos
- [ ] Sistema de referidos
- [ ] API pública
- [ ] App móvil (React Native)
- [ ] Notificaciones push

---

## 📊 Monitoreo y Analytics

### Supabase Dashboard
Ve a **Database** → **Table Editor** para ver:
- Usuarios registrados
- Ofertas publicadas
- Likes totales

### Queries útiles
Usa el archivo `supabase-queries.sql` para ver estadísticas.

---

## 🆘 Ayuda

Si tienes problemas:
1. Revisa `TROUBLESHOOTING.md`
2. Verifica los errores en la consola del navegador
3. Verifica los logs de Supabase Dashboard
4. Revisa que las RLS policies estén activas

---

## 🎉 ¡Listo!

Ahora tienes Ofertonazos funcionando completamente. 

**Próximo paso recomendado:** Invita a algunos amigos para que prueben la plataforma y te den feedback.

---

**¡A cazar ofertas! 🔥**

-- ============================================
-- QUICK SETUP QUERIES
-- ============================================

-- Ver todos los usuarios
select * from profiles;

-- Ver todas las ofertas
select * from offers order by created_at desc;

-- Hacer a un usuario ADMIN
update profiles
set role = 'admin'
where email = 'tu-email@gmail.com';

-- Activar suscripción a un usuario
update profiles
set subscription_active = true
where email = 'usuario@gmail.com';

-- Ver ofertas con información del usuario
select 
  o.*,
  p.name as user_name,
  p.email as user_email
from offers o
join profiles p on o.user_id = p.id
order by o.created_at desc;

-- Ver estadísticas
select 
  count(*) as total_offers,
  count(distinct user_id) as total_users,
  sum(likes_count) as total_likes
from offers;

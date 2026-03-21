-- ============================================================
-- Búsqueda full-text optimizada para la tabla offers
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Columna tsvector generada automáticamente (Spanish)
--    Combina title (peso A = más relevante) + description (peso B)
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
  ) STORED;

-- 2. Índice GIN sobre la columna fts (búsqueda O(log n) en lugar de O(n))
CREATE INDEX IF NOT EXISTS offers_fts_idx ON offers USING GIN (fts);

-- 3. (Opcional) Índice adicional para búsquedas parciales con ILIKE
--    Activa si usas .ilike() como fallback
CREATE INDEX IF NOT EXISTS offers_title_trgm_idx ON offers
  USING GIN (title gin_trgm_ops);

-- Para activar el índice trigram necesitas la extensión pg_trgm:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Una vez ejecutada esta migración, cambia la query en
-- hooks/useSearch.ts de:
--
--   .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
--
-- a (mucho más rápido con miles de registros):
--
--   .textSearch('fts', term, { type: 'websearch', config: 'spanish' })
--
-- ============================================================

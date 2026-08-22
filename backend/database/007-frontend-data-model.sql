-- Frontend data model extensions: product metadata and owned media files.
-- Files currently arrive as data URLs from the browser. content_base64 keeps
-- the current API compatible while storage_key allows migration to object
-- storage later without changing the relational model.

ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS interest_rate_max NUMERIC(7, 3);
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS processing_days INTEGER NOT NULL DEFAULT 0;
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS collateral_required BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS collateral_text TEXT;
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2);
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS reviews_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS application_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
  content_base64 TEXT NOT NULL,
  media_type VARCHAR(30) NOT NULL DEFAULT 'document',
  storage_key TEXT,
  checksum_sha256 VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE application_media ADD COLUMN IF NOT EXISTS media_type VARCHAR(30) NOT NULL DEFAULT 'document';
ALTER TABLE application_media ADD COLUMN IF NOT EXISTS storage_key TEXT;
ALTER TABLE application_media ADD COLUMN IF NOT EXISTS checksum_sha256 VARCHAR(64);

CREATE TABLE IF NOT EXISTS user_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_type VARCHAR(30) NOT NULL CHECK (media_type IN ('avatar', 'institution_logo', 'identity_document', 'other')),
  name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
  content_base64 TEXT,
  storage_key TEXT,
  checksum_sha256 VARCHAR(64),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES loan_products(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_type VARCHAR(30) NOT NULL CHECK (media_type IN ('image', 'document', 'brochure', 'other')),
  name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
  content_base64 TEXT,
  storage_key TEXT,
  checksum_sha256 VARCHAR(64),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS user_media_user_id_idx ON user_media(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_media_primary_type_idx ON user_media(user_id, media_type) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS product_media_product_id_idx ON product_media(product_id, sort_order);

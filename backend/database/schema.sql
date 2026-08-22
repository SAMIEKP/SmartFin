-- SmartFin backend schema
-- Run against the configured PostgreSQL database (smartfin_db).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS password_resets_email_idx ON password_resets(email);

CREATE TABLE IF NOT EXISTS pending_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'provider')),
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_channel VARCHAR(20) NOT NULL CHECK (verification_channel IN ('email', 'sms', 'call', 'whatsapp')),
  verification_code_hash TEXT NOT NULL,
  verification_expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'provider')),
  name VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  income_range VARCHAR(100),
  institution_name VARCHAR(255),
  contact_person VARCHAR(255),
  institution_type VARCHAR(100),
  registration_number VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  financial_goal TEXT,
  theme VARCHAR(10) NOT NULL DEFAULT 'light',
  font_size VARCHAR(10) NOT NULL DEFAULT 'default',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  segment VARCHAR(50),
  district VARCHAR(100),
  city_village VARCHAR(150),
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  needs JSONB NOT NULL DEFAULT '[]'::jsonb,
  profile_status VARCHAR(30) NOT NULL DEFAULT 'incomplete',
  provider_status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
  lending_policy TEXT,
  interest_policy TEXT,
  late_payment_policy TEXT,
  data_privacy_statement TEXT,
  notification_preferences JSONB NOT NULL DEFAULT '{"sms":true,"email":true,"in_app":true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS individual_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  income_range VARCHAR(100),
  segment VARCHAR(50),
  district VARCHAR(100),
  city_village VARCHAR(150),
  needs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  institution_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  institution_type VARCHAR(100),
  registration_number VARCHAR(100),
  branch_location VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
  available_at TIMESTAMPTZ,
  registration_certificate_path TEXT,
  business_license_path TEXT,
  tax_clearance_path TEXT,
  other_documents_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pending_registration_id UUID NOT NULL REFERENCES pending_registrations(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  min_amount NUMERIC(14, 2),
  max_amount NUMERIC(14, 2),
  interest_rate NUMERIC(7, 3),
  tenure VARCHAR(100),
  description TEXT,
  eligibility_criteria JSONB,
  required_documents JSONB,
  application_questions JSONB,
  interest_type VARCHAR(20) NOT NULL DEFAULT 'fixed',
  repayment_schedule VARCHAR(20) NOT NULL DEFAULT 'monthly',
  fees JSONB NOT NULL DEFAULT '[]'::jsonb,
  interest_rate_max NUMERIC(7, 3),
  processing_days INTEGER NOT NULL DEFAULT 0,
  collateral_required BOOLEAN NOT NULL DEFAULT false,
  collateral_text TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2),
  reviews_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS application_questions JSONB;

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES loan_products(id) ON DELETE CASCADE,
  answers JSONB,
  documents JSONB,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  content_base64 TEXT NOT NULL,
  media_type VARCHAR(30) NOT NULL DEFAULT 'document',
  storage_key TEXT,
  checksum_sha256 VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS loan_products_provider_id_idx ON loan_products(provider_id);
CREATE INDEX IF NOT EXISTS loan_products_active_idx ON loan_products(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS loan_products_provider_name_unique_idx
  ON loan_products(provider_id, LOWER(name));
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_product_id_idx ON applications(product_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE INDEX IF NOT EXISTS application_media_application_id_idx ON application_media(application_id);
CREATE INDEX IF NOT EXISTS user_media_user_id_idx ON user_media(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_media_primary_type_idx ON user_media(user_id, media_type) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS product_media_product_id_idx ON product_media(product_id, sort_order);

INSERT INTO individual_profiles (user_id, full_name, location, income_range, segment, district, city_village, needs)
SELECT id, COALESCE(name, email), location, income_range, segment, district, city_village, needs
FROM users WHERE role = 'user'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO provider_profiles (user_id, institution_name, contact_person, institution_type, registration_number, status)
SELECT id, COALESCE(institution_name, name, email), contact_person, institution_type, registration_number, provider_status
FROM users WHERE role = 'provider'
ON CONFLICT (user_id) DO NOTHING;
CREATE UNIQUE INDEX IF NOT EXISTS applications_pending_product_user_idx
  ON applications(user_id, product_id)
  WHERE status IN ('pending', 'under_review');

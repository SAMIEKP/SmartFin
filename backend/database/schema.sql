-- SmartFin backend schema
-- Run against the configured PostgreSQL database (smartfin_db).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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

CREATE INDEX IF NOT EXISTS loan_products_provider_id_idx ON loan_products(provider_id);
CREATE INDEX IF NOT EXISTS loan_products_active_idx ON loan_products(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS loan_products_provider_name_unique_idx
  ON loan_products(provider_id, LOWER(name));
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_product_id_idx ON applications(product_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE UNIQUE INDEX IF NOT EXISTS applications_pending_product_user_idx
  ON applications(user_id, product_id)
  WHERE status IN ('pending', 'under_review');

-- Registration workflow tables for existing databases initialized before schema.sql.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
  available_at TIMESTAMPTZ,
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
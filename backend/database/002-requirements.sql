-- FinAccess Connect requirements: profile preferences, provider policies,
-- notifications, and repayment tracking.

ALTER TABLE users ADD COLUMN IF NOT EXISTS segment VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city_village VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS needs JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_status VARCHAR(30) NOT NULL DEFAULT 'incomplete';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_status VARCHAR(30) NOT NULL DEFAULT 'pending_review';
ALTER TABLE users ADD COLUMN IF NOT EXISTS lending_policy TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interest_policy TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS late_payment_policy TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_privacy_statement TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL DEFAULT '{"sms":true,"email":true,"in_app":true}'::jsonb;

ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS interest_type VARCHAR(20) NOT NULL DEFAULT 'fixed';
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS repayment_schedule VARCHAR(20) NOT NULL DEFAULT 'monthly';
ALTER TABLE loan_products ADD COLUMN IF NOT EXISTS fees JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(40) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS approved_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES loan_products(id) ON DELETE CASCADE,
  outstanding_balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  next_payment_due DATE,
  payment_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  payment_frequency VARCHAR(20) NOT NULL DEFAULT 'monthly',
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

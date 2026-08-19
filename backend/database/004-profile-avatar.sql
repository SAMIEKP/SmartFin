-- Persist account profile pictures, including provider institution logos.

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
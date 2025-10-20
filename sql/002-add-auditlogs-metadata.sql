-- Migration: ensure audit_logs.metadata column exists
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS metadata JSON NULL;

-- Fallback for older MySQL versions without JSON support: comment out above and use LONGTEXT
-- ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata LONGTEXT NULL;

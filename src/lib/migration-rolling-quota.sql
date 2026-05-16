-- ============================================
-- MIGRATION: Rolling quota reset tracking
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add first_quota_used_at column to track when user first generated
-- This is the anchor date for the 30-day rolling window (free plan)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_quota_used_at TIMESTAMPTZ;

-- Add subscription_started_at to track when a paid subscription began
ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ;

-- Update existing free users who have used quota but no reset date set:
-- Set their reset date to 30 days from now (safe default)
UPDATE users
SET 
  quota_reset_at = NOW() + INTERVAL '30 days',
  first_quota_used_at = NOW()
WHERE 
  plan = 'free' 
  AND quota_used > 0 
  AND quota_reset_at IS NULL;

-- Index for fast reset date queries (for background jobs)
CREATE INDEX IF NOT EXISTS idx_users_quota_reset ON users(quota_reset_at);
CREATE INDEX IF NOT EXISTS idx_users_plan_quota ON users(plan, quota_used, quota_limit);

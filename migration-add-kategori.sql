-- =====================================================
-- Migration: Add kategori column to pemerintahan table
-- Database: PostgreSQL
-- =====================================================

-- Add kategori column if it doesn't exist
ALTER TABLE pemerintahan 
ADD COLUMN IF NOT EXISTS kategori VARCHAR(50) DEFAULT 'perangkat_desa';

-- Add constraint to kategori
ALTER TABLE pemerintahan
ADD CONSTRAINT pemerintahan_kategori_check 
CHECK (kategori IN ('pemimpin_desa', 'perangkat_desa', 'perangkat_penunjang'))
NOT VALID;

-- Validate constraint
ALTER TABLE pemerintahan VALIDATE CONSTRAINT pemerintahan_kategori_check;

-- Display tabel structure
SELECT * FROM pemerintahan;

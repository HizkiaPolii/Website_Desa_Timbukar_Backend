-- =====================================================
-- Migration: Fix foto field dan kategori
-- Purpose: Set default foto dan fix NULL values
-- =====================================================

-- 1. Alter table pemerintahan to set default foto
ALTER TABLE pemerintahan 
ALTER COLUMN foto SET DEFAULT '/images/pemerintahan/default.jpg';

-- 2. Update existing NULL foto values to default
UPDATE pemerintahan 
SET foto = '/images/pemerintahan/default.jpg' 
WHERE foto IS NULL 
   OR foto = '';

-- 3. Set kategori default for NULL values
UPDATE pemerintahan 
SET kategori = 'perangkat_desa' 
WHERE kategori IS NULL 
   OR kategori = '';

-- 4. Verify the changes
SELECT id, nama, jabatan, foto, kategori 
FROM pemerintahan 
ORDER BY id;

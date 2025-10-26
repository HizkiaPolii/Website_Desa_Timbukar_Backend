-- Fix kategori pemerintahan yang NULL atau tidak sesuai
-- Set semua data ke 'perangkat_desa' sebagai default

UPDATE pemerintahan 
SET kategori = 'perangkat_desa' 
WHERE kategori IS NULL 
   OR kategori = '';

-- Verifikasi hasilnya
SELECT id, nama, jabatan, kategori 
FROM pemerintahan 
ORDER BY id;

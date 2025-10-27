-- Insert Data Awal ke Database Desa Timbukar

-- 1. Insert ke desa_statistics
INSERT INTO desa_statistics (populasi, kepala_keluarga, luas_wilayah, angka_pertumbuhan, jumlah_bayi, angka_harapan_hidup) 
VALUES ('2,500', '625', '45.5 km²', '2.5%', '180', '72 Tahun')
ON CONFLICT DO NOTHING;

-- 2. Insert ke desa_demographics
INSERT INTO desa_demographics (kategori_usia, jumlah, persentase) VALUES
('Usia 0-5 Tahun', 200, '8%'),
('Usia 5-15 Tahun', 375, '15%'),
('Usia 15-65 Tahun', 1700, '68%'),
('Usia 65+ Tahun', 225, '9%')
ON CONFLICT DO NOTHING;

-- 3. Insert ke desa_gender
INSERT INTO desa_gender (jenis_kelamin, jumlah, persentase) VALUES
('Laki-laki', 1275, '51%'),
('Perempuan', 1225, '49%')
ON CONFLICT DO NOTHING;

-- 4. Insert ke desa_education
INSERT INTO desa_education (tingkat_pendidikan, jumlah, persentase) VALUES
('Tidak Sekolah', 125, '5%'),
('SD/Sederajat', 625, '25%'),
('SMP/Sederajat', 750, '30%'),
('SMA/Sederajat', 700, '28%'),
('D1/D2/D3', 150, '6%'),
('S1/S2/S3', 175, '7%')
ON CONFLICT DO NOTHING;

-- 5. Insert ke desa_religion
INSERT INTO desa_religion (agama, jumlah, persentase) VALUES
('Islam', 2000, '80%'),
('Kristen', 300, '12%'),
('Katolik', 100, '4%'),
('Hindu', 50, '2%'),
('Buddha', 30, '1.2%'),
('Lainnya', 20, '0.8%')
ON CONFLICT DO NOTHING;

-- Verifikasi data
SELECT COUNT(*) as total_statistics FROM desa_statistics;
SELECT COUNT(*) as total_demographics FROM desa_demographics;
SELECT COUNT(*) as total_gender FROM desa_gender;
SELECT COUNT(*) as total_education FROM desa_education;
SELECT COUNT(*) as total_religion FROM desa_religion;

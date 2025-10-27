-- Setup Database Tables untuk Data Desa Timbukar
-- Pastikan database desa-timbukar sudah terbuat

-- Tabel Utama: Statistik Desa
CREATE TABLE IF NOT EXISTS desa_statistics (
  id SERIAL PRIMARY KEY,
  populasi VARCHAR(50) NOT NULL,
  kepala_keluarga VARCHAR(50) NOT NULL,
  luas_wilayah VARCHAR(50) NOT NULL,
  angka_pertumbuhan VARCHAR(50) NOT NULL,
  jumlah_bayi VARCHAR(50) NOT NULL,
  angka_harapan_hidup VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel: Demografi Penduduk (Distribusi Usia)
CREATE TABLE IF NOT EXISTS desa_demographics (
  id SERIAL PRIMARY KEY,
  kategori_usia VARCHAR(50) NOT NULL,
  jumlah INT NOT NULL,
  persentase VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel: Jenis Kelamin
CREATE TABLE IF NOT EXISTS desa_gender (
  id SERIAL PRIMARY KEY,
  jenis_kelamin VARCHAR(20) NOT NULL,
  jumlah INT NOT NULL,
  persentase VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel: Tingkat Pendidikan
CREATE TABLE IF NOT EXISTS desa_education (
  id SERIAL PRIMARY KEY,
  tingkat_pendidikan VARCHAR(100) NOT NULL,
  jumlah INT NOT NULL,
  persentase VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel: Agama/Kepercayaan
CREATE TABLE IF NOT EXISTS desa_religion (
  id SERIAL PRIMARY KEY,
  agama VARCHAR(50) NOT NULL,
  jumlah INT NOT NULL,
  persentase VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data untuk Statistik Desa
INSERT INTO desa_statistics (populasi, kepala_keluarga, luas_wilayah, angka_pertumbuhan, jumlah_bayi, angka_harapan_hidup)
VALUES ('2,500', '625', '45.5 km²', '2.5%', '180', '72 Tahun')
ON CONFLICT DO NOTHING;

-- Insert default data untuk Demografi
INSERT INTO desa_demographics (kategori_usia, jumlah, persentase) VALUES
('Usia 0-5 Tahun', 200, '8%'),
('Usia 5-15 Tahun', 375, '15%'),
('Usia 15-65 Tahun', 1700, '68%'),
('Usia 65+ Tahun', 225, '9%')
ON CONFLICT DO NOTHING;

-- Insert default data untuk Jenis Kelamin
INSERT INTO desa_gender (jenis_kelamin, jumlah, persentase) VALUES
('Laki-laki', 1275, '51%'),
('Perempuan', 1225, '49%')
ON CONFLICT DO NOTHING;

-- Insert default data untuk Pendidikan
INSERT INTO desa_education (tingkat_pendidikan, jumlah, persentase) VALUES
('Tidak Sekolah', 125, '5%'),
('SD/Sederajat', 625, '25%'),
('SMP/Sederajat', 750, '30%'),
('SMA/Sederajat', 700, '28%'),
('D1/D2/D3', 150, '6%'),
('S1/S2/S3', 175, '7%')
ON CONFLICT DO NOTHING;

-- Insert default data untuk Agama
INSERT INTO desa_religion (agama, jumlah, persentase) VALUES
('Islam', 2000, '80%'),
('Kristen', 300, '12%'),
('Katolik', 100, '4%'),
('Hindu', 50, '2%'),
('Buddha', 30, '1.2%'),
('Lainnya', 20, '0.8%')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SQL Script untuk Setup PostgreSQL Database
-- Desa Timbukar Information System
-- ============================================================

-- ============================================================
-- 1. CREATE USER DAN DATABASE
-- ============================================================

-- Jalankan command ini dari postgres user:
-- createuser desa_timbukar
-- createdb -O desa_timbukar desa_timbukar_db

-- Atau via psql:
-- psql -U postgres -c "CREATE USER desa_timbukar WITH PASSWORD 'desa_timbukar_password';"
-- psql -U postgres -c "CREATE DATABASE desa_timbukar_db OWNER desa_timbukar;"

-- ============================================================
-- 2. TABEL USERS (AUTHENTICATION)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default admin user (password: admin123)
-- Password hash untuk "admin123" dengan bcrypt
INSERT INTO users (username, password, email, role) 
VALUES ('admin', '$2b$10$REr67xtbi1O1OmGmqXx.pOY7uF805jUdU27CVAcawGgLEe9Y9LAtq', 'admin@timbukar.desa.id', 'admin')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- 3. TABEL PROFIL DESA
-- ============================================================

CREATE TABLE IF NOT EXISTS profil_desa (
  id SERIAL PRIMARY KEY,
  nama_desa VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100),
  kabupaten VARCHAR(100),
  kecamatan VARCHAR(100),
  luas_wilayah VARCHAR(50),
  jumlah_penduduk INTEGER,
  deskripsi TEXT,
  website VARCHAR(255),
  telepon VARCHAR(20),
  email VARCHAR(100),
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data default Desa Timbukar
INSERT INTO profil_desa (
  nama_desa, provinsi, kabupaten, kecamatan, 
  luas_wilayah, jumlah_penduduk, deskripsi,
  website, telepon, email, alamat
) VALUES (
  'Timbukar',
  'Nusa Tenggara Barat',
  'Lombok Timur',
  'Selong',
  '45.50 km²',
  8500,
  'Desa yang indah dengan keindahan alam yang memukau. Masyarakat Desa Timbukar terkenal dengan kearifan lokal dan gotong royong yang kuat.',
  'https://timbukar.desa.id',
  '(0376) 123456',
  'admin@timbukar.desa.id',
  'Jl. Raya Timbukar No. 1'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. TABEL PEMERINTAHAN DESA
-- ============================================================

CREATE TABLE IF NOT EXISTS pemerintahan (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100),
  nip VARCHAR(50),
  periode_periode VARCHAR(50),
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  pendidikan VARCHAR(100),
  agama VARCHAR(50),
  jenis_kelamin VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pemerintahan_jabatan ON pemerintahan(jabatan);

-- Insert data default
INSERT INTO pemerintahan (
  nama, jabatan, nip, periode_periode, alamat, telepon, 
  email, pendidikan, agama, jenis_kelamin
) VALUES 
  ('Budi Santoso', 'Kepala Desa', '123456789', '2021-2026', 
   'Jl. Raya Timbukar No. 1', '081234567890', 'budi@desa.id',
   'S1 Administrasi Publik', 'Islam', 'Laki-laki'),
  ('Siti Nurhaliza', 'Sekretaris Desa', '123456790', '2021-2026',
   'Jl. Raya Timbukar No. 2', '081234567891', 'siti@desa.id',
   'S1 Hukum', 'Islam', 'Perempuan'),
  ('Ahmad Wijaya', 'Bendahara Desa', '123456791', '2021-2026',
   'Jl. Raya Timbukar No. 3', '081234567892', 'ahmad@desa.id',
   'S1 Akuntansi', 'Islam', 'Laki-laki')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. TABEL BUMDES
-- ============================================================

CREATE TABLE IF NOT EXISTS bumdes (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  bidang_usaha VARCHAR(255),
  nomor_legalitas VARCHAR(100),
  tanggal_dibentuk DATE,
  modal BIGINT,
  pengurus VARCHAR(100),
  kontak_person VARCHAR(100),
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bumdes_nama ON bumdes(nama);

-- Insert data default
INSERT INTO bumdes (
  nama, deskripsi, bidang_usaha, nomor_legalitas,
  tanggal_dibentuk, modal, pengurus, kontak_person, alamat
) VALUES 
  ('BUMDES Timbukar Jaya', 
   'Badan Usaha Milik Desa yang mengelola berbagai usaha produktif',
   'Perdagangan, Pertanian, Pariwisata',
   '001/BUMDES/2021',
   '2021-01-15',
   500000000,
   'Sumarno',
   '081234567890',
   'Jl. Raya Timbukar No. 5')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. TABEL LEMBAGA MASYARAKAT
-- ============================================================

CREATE TABLE IF NOT EXISTS lembaga_masyarakat (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  jenis_lembaga VARCHAR(100),
  ketua VARCHAR(100),
  visi TEXT,
  misi TEXT,
  kontak_person VARCHAR(100),
  email VARCHAR(100),
  alamat TEXT,
  tahun_berdiri INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lembaga_nama ON lembaga_masyarakat(nama);

-- Insert data default
INSERT INTO lembaga_masyarakat (
  nama, deskripsi, jenis_lembaga, ketua,
  visi, misi, kontak_person, email, alamat, tahun_berdiri
) VALUES 
  ('PKK Timbukar',
   'Pemberdayaan Kesejahteraan Keluarga',
   'Sosial Kemasyarakatan',
   'Siti Nurhaliza',
   'Memberdayakan keluarga untuk hidup sejahtera',
   'Memberikan pelatihan keterampilan kepada keluarga',
   '081234567890',
   'pkk@timbukar.desa.id',
   'Jl. Raya Timbukar No. 3',
   2015)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. TABEL DATA DESA
-- ============================================================

CREATE TABLE IF NOT EXISTS data_desa (
  id SERIAL PRIMARY KEY,
  kategori VARCHAR(100) NOT NULL,
  jumlah_penduduk INTEGER,
  jumlah_kepala_keluarga INTEGER,
  laki_laki INTEGER,
  perempuan INTEGER,
  total_sekolah INTEGER,
  tingkat_tamat VARCHAR(100),
  data_lainnya JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_data_desa_kategori ON data_desa(kategori);

-- Insert data default
INSERT INTO data_desa (
  kategori, jumlah_penduduk, jumlah_kepala_keluarga,
  laki_laki, perempuan, total_sekolah, tingkat_tamat
) VALUES 
  ('Kependudukan', 8500, 1700, 4200, 4300, NULL, NULL),
  ('Pendidikan', NULL, NULL, NULL, NULL, 5, 'SMA')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. VERIFY DATA
-- ============================================================

-- Uncomment untuk verify semua table:
-- SELECT * FROM users;
-- SELECT * FROM profil_desa;
-- SELECT * FROM pemerintahan;
-- SELECT * FROM bumdes;
-- SELECT * FROM lembaga_masyarakat;
-- SELECT * FROM data_desa;

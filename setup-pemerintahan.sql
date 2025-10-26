-- =====================================================
-- Setup Tabel Pemerintahan Desa
-- Database: PostgreSQL
-- =====================================================

-- Create pemerintahan table
CREATE TABLE IF NOT EXISTS pemerintahan (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  nip VARCHAR(20) UNIQUE NOT NULL,
  no_telepon VARCHAR(15) NOT NULL,
  alamat TEXT NOT NULL,
  foto VARCHAR(255) DEFAULT '/images/pemerintahan/default.jpg',
  kategori VARCHAR(50) DEFAULT 'perangkat_desa' CHECK (kategori IN ('pemimpin_desa', 'perangkat_desa', 'perangkat_penunjang')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes untuk performa query
CREATE INDEX IF NOT EXISTS idx_pemerintahan_jabatan ON pemerintahan(jabatan);
CREATE INDEX IF NOT EXISTS idx_pemerintahan_nip ON pemerintahan(nip);

-- Insert sample data (optional)
INSERT INTO pemerintahan (nama, jabatan, nip, no_telepon, alamat, foto)
VALUES
  ('Budi Santoso', 'Kepala Desa', '123456789012345', '081234567890', 'Jl. Raya Timbukar No. 1', '/images/pemerintahan/budi.jpg'),
  ('Siti Nurhaliza', 'Sekretaris Desa', '123456789012346', '081234567891', 'Jl. Raya Timbukar No. 2', '/images/pemerintahan/siti.jpg'),
  ('Bambang Suryanto', 'Bendahara Desa', '123456789012347', '081234567892', 'Jl. Raya Timbukar No. 3', '/images/pemerintahan/bambang.jpg')
ON CONFLICT DO NOTHING;

-- Display tabel structure
SELECT * FROM pemerintahan;

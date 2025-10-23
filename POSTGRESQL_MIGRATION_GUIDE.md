# Panduan Migrasi dari MySQL ke PostgreSQL

## 📋 Daftar Isi

1. [Install PostgreSQL](#install-postgresql)
2. [Setup Database](#setup-database)
3. [Update Backend Code](#update-backend-code)
4. [Konfigurasi Connection](#konfigurasi-connection)
5. [Testing](#testing)

---

## Install PostgreSQL

### Windows

#### Opsi 1: Download Installer (Recommended)

1. Download dari: https://www.postgresql.org/download/windows/
2. Jalankan installer
3. Pilih components: PostgreSQL Server, pgAdmin 4
4. Set password untuk user `postgres`
5. Port default: `5432`

#### Opsi 2: Windows Store

```powershell
# Install dari Microsoft Store
winget install PostgreSQL.PostgreSQL
```

#### Opsi 3: WSL (Windows Subsystem for Linux)

```bash
# Di WSL terminal
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### Verifikasi Instalasi

```powershell
# Check versi PostgreSQL
psql --version

# Atau jalankan pgAdmin
# http://localhost:5050
```

---

## Setup Database

### 1. Connect ke PostgreSQL

**Via Command Line:**

```powershell
# Connect sebagai admin
psql -U postgres

# Password: (masukkan password yang Anda set saat install)
```

**Via pgAdmin:**

1. Buka http://localhost:5050
2. Login dengan email dan password yang Anda set
3. Right-click "Servers" → Create → Server

### 2. Buat Database dan User

```sql
-- Login sebagai postgres user dulu
-- psql -U postgres

-- Buat user baru
CREATE USER desa_timbukar WITH PASSWORD 'your_password_here';

-- Buat database
CREATE DATABASE desa_timbukar_db OWNER desa_timbukar;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE desa_timbukar_db TO desa_timbukar;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO desa_timbukar;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO desa_timbukar;
```

### 3. Verifikasi Koneksi

```powershell
# Connect ke database baru
psql -U desa_timbukar -d desa_timbukar_db -h localhost

# Jika berhasil, prompt akan berubah menjadi:
# desa_timbukar_db=>
```

---

## Update Backend Code

### Step 1: Uninstall MySQL2 dan Install pg

```bash
cd d:\KKT\Web-Desa-TImbukar-Backend

# Uninstall mysql
npm uninstall mysql2

# Install PostgreSQL client
npm install pg
npm install --save-dev @types/pg
```

### Step 2: Update config/database.ts

**File**: `src/config/database.ts`

```typescript
import dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "desa_timbukar",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "desa_timbukar_db",
};

export const appConfig = {
  port: parseInt(process.env.PORT || "5000"),
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
};
```

### Step 3: Update config/connectionPool.ts

**File**: `src/config/connectionPool.ts`

```typescript
import { Pool } from "pg";
import { dbConfig } from "./database.js";

let pool: Pool;

export async function initializeDatabase() {
  pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await pool.connect();
    console.log("✅ Database pool created successfully");
    console.log(
      `Connected to PostgreSQL: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`
    );
    client.release();
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    throw err;
  }

  return pool;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    console.log("Database connection closed");
  }
}
```

---

## Konfigurasi Connection

### Setup Environment Variables

**File**: `.env` (atau `.env.development`)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=desa_timbukar
DB_PASSWORD=your_password
DB_NAME=desa_timbukar_db

# App
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

### Jangan Lupa Update .gitignore

```
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

## Membuat Tabel di PostgreSQL

Jalankan SQL queries berikut untuk membuat tabel yang sesuai dengan API:

### 1. Tabel Users (untuk authentication)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
```

### 2. Tabel Profil Desa

```sql
CREATE TABLE profil_desa (
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
```

### 3. Tabel Pemerintahan

```sql
CREATE TABLE pemerintahan (
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

CREATE INDEX idx_pemerintahan_jabatan ON pemerintahan(jabatan);
```

### 4. Tabel BUMDES

```sql
CREATE TABLE bumdes (
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

CREATE INDEX idx_bumdes_nama ON bumdes(nama);
```

### 5. Tabel Lembaga Masyarakat

```sql
CREATE TABLE lembaga_masyarakat (
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

CREATE INDEX idx_lembaga_nama ON lembaga_masyarakat(nama);
```

### 6. Tabel Data Desa

```sql
CREATE TABLE data_desa (
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

CREATE INDEX idx_data_desa_kategori ON data_desa(kategori);
```

---

## Testing

### Test Connection

```bash
cd d:\KKT\Web-Desa-TImbukar-Backend

# Run backend
npm run dev
```

Anda akan melihat log:

```
✅ Database pool created successfully
Connected to PostgreSQL: desa_timbukar_db@localhost:5432
Server running on port 5000
```

### Test API Endpoint

**Di Browser Console:**

```javascript
// Test health check
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log("✅ Backend:", d));

// Test get profil
fetch("http://localhost:5000/api/profil")
  .then((r) => r.json())
  .then((d) => console.log("✅ Profil Data:", d));
```

### Insert Data Test di PostgreSQL

```sql
-- Insert ke profil_desa
INSERT INTO profil_desa (
  nama_desa, provinsi, kabupaten, kecamatan,
  luas_wilayah, jumlah_penduduk, deskripsi
) VALUES (
  'Timbukar',
  'Nusa Tenggara Barat',
  'Lombok Timur',
  'Selong',
  '45.50 km²',
  8500,
  'Desa yang indah dengan keindahan alam yang memukau'
);

-- Verify
SELECT * FROM profil_desa;
```

---

## Troubleshooting

### Error: "Cannot connect to database"

**Solusi:**

1. Pastikan PostgreSQL service running
   ```powershell
   Get-Service postgresql-* | Start-Service
   ```
2. Check config di `.env` file
3. Verify credentials di pgAdmin

### Error: "relation does not exist"

**Solusi:**
Jalankan SQL queries untuk membuat tabel (lihat bagian "Membuat Tabel")

### Error: "password authentication failed"

**Solusi:**

1. Reset password user PostgreSQL:
   ```sql
   ALTER USER desa_timbukar WITH PASSWORD 'new_password';
   ```
2. Update di `.env` file

### Port 5432 sudah terpakai

**Solusi:**

```powershell
# Kill process menggunakan port 5432
Get-Process -Id (Get-NetTCPConnection -LocalPort 5432).OwningProcess | Stop-Process -Force

# Atau ubah port di config database.ts
DB_PORT=5433
```

---

## Comparison: MySQL vs PostgreSQL

| Fitur        | MySQL           | PostgreSQL                |
| ------------ | --------------- | ------------------------- |
| Type System  | Lemah           | Kuat (better type safety) |
| JSON Support | Terbatas        | Excellent (JSONB)         |
| Indexing     | Baik            | Lebih baik                |
| Transaction  | Standar         | Advanced                  |
| Performance  | Bagus untuk web | Lebih scalable            |
| License      | Open Source     | Open Source               |

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database & user
3. ✅ Update backend code
4. ✅ Create tables
5. ⏭️ Test connection
6. ⏭️ Insert sample data
7. ⏭️ Deploy to production

---

## Catatan Penting

- PostgreSQL lebih robust untuk production
- JSONB support sangat berguna untuk flexible data
- Pastikan backup database secara berkala
- Gunakan connection pooling untuk production (sudah ada di code)

Sukses! 🚀

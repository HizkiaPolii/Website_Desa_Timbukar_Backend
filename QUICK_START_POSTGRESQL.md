# 🚀 QUICK START - Setup PostgreSQL

## Status: Backend sudah siap untuk PostgreSQL ✅

Backend code sudah diupdate untuk menggunakan PostgreSQL. Sekarang ikuti langkah-langkah berikut:

---

## Step 1: Install PostgreSQL

### Windows Download

- Download dari: https://www.postgresql.org/download/windows/
- Install dengan default settings
- Remember port: **5432**
- Password untuk user `postgres`: **catat baik-baik!**

### Verifikasi Instalasi

```powershell
psql --version
```

---

## Step 2: Buat Database & User

Buka PostgreSQL command prompt atau PowerShell:

```powershell
# Connect ke PostgreSQL default
psql -U postgres

# Masukkan password untuk user postgres
```

Jika berhasil, prompt akan menjadi:

```
postgres=#
```

Copy-paste commands ini satu per satu:

```sql
-- Buat user baru
CREATE USER desa_timbukar WITH PASSWORD 'desa_timbukar_password';

-- Buat database
CREATE DATABASE desa_timbukar_db OWNER desa_timbukar;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE desa_timbukar_db TO desa_timbukar;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO desa_timbukar;

-- Exit
\q
```

---

## Step 3: Setup Database Schema

Buka file SQL di project backend:

```powershell
# Navigate ke backend folder
cd d:\KKT\Web-Desa-TImbukar-Backend

# Jalankan SQL setup script
psql -U desa_timbukar -d desa_timbukar_db -f setup-postgresql.sql
```

Jika berhasil, Anda akan melihat output seperti:

```
CREATE TABLE
CREATE INDEX
INSERT 0 1
```

---

## Step 4: Verifikasi Setup

```powershell
# Connect ke database baru
psql -U desa_timbukar -d desa_timbukar_db

# Di prompt, jalankan:
SELECT * FROM profil_desa;
SELECT * FROM users;
SELECT * FROM pemerintahan;

# Exit
\q
```

---

## Step 5: Test Backend

```bash
cd d:\KKT\Web-Desa-TImbukar-Backend

# Start backend
npm run dev
```

Anda akan melihat log:

```
✅ Database pool created successfully
Connected to PostgreSQL: desa_timbukar_db@localhost:5432
Server running on port 5000
```

---

## Step 6: Test API

Buka browser dan jalankan di console (F12):

```javascript
// Test health
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log("✅ Backend:", d));

// Test get profil (dari database PostgreSQL)
fetch("http://localhost:5000/api/profil")
  .then((r) => r.json())
  .then((d) => console.log("✅ Profil dari DB:", d.data));

// Test login
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" }),
})
  .then((r) => r.json())
  .then((d) => console.log("✅ Token:", d.token));
```

---

## Checklist

- [ ] PostgreSQL installed & running
- [ ] Database `desa_timbukar_db` created
- [ ] User `desa_timbukar` created
- [ ] SQL script executed successfully
- [ ] Backend running without errors
- [ ] API endpoints responding correctly
- [ ] Data visible in pgAdmin atau psql

---

## Troubleshooting

### Error: "psql: command not found"

- PostgreSQL belum ter-install atau PATH belum di-set
- Solusi: Restart PowerShell setelah install PostgreSQL

### Error: "password authentication failed"

- Password salah atau user belum dibuat
- Solusi: Jalankan SQL commands lagi (Step 2)

### Error: "could not connect to server"

- PostgreSQL service tidak running
- Solusi:

  ```powershell
  # Windows Services
  Get-Service postgresql-* | Start-Service

  # atau di WSL
  sudo service postgresql start
  ```

### Error: "database does not exist"

- Database belum dibuat atau SQL script gagal
- Solusi: Jalankan setup-postgresql.sql lagi (Step 3)

### Error: Cannot find node_modules/pg

- Package belum ter-install
- Solusi:
  ```bash
  npm install pg @types/pg
  ```

---

## Default Credentials

```
Admin Login:
- Username: admin
- Password: admin123

Database:
- Host: localhost
- Port: 5432
- User: desa_timbukar
- Password: desa_timbukar_password
- Database: desa_timbukar_db
```

---

## Useful Commands

```powershell
# Connect ke database
psql -U desa_timbukar -d desa_timbukar_db

# List semua databases
\l

# Connect ke database lain
\c database_name

# List semua tables
\dt

# Describe table structure
\d table_name

# Exit
\q

# Run SQL file
psql -U desa_timbukar -d desa_timbukar_db -f filename.sql

# Backup database
pg_dump -U desa_timbukar -d desa_timbukar_db > backup.sql

# Restore database
psql -U desa_timbukar -d desa_timbukar_db < backup.sql
```

---

## pgAdmin (GUI)

Untuk easier management:

1. Buka http://localhost:5050
2. Login dengan email yang Anda set saat install
3. Add Server:
   - Host: localhost
   - Port: 5432
   - Username: desa_timbukar
   - Password: desa_timbukar_password

---

## Next Steps

✅ PostgreSQL setup selesai!

Sekarang bisa:

- Connect frontend ke backend
- Test semua API endpoints
- Insert data real di database
- Mulai development features

Sukses! 🎉

# 🚀 Setup Backend - Pemerintahan Desa

## ✅ Backend Controller (DONE)

File: `src/controllers/pemerintahanController.ts`

Sudah diimplementasikan dengan:

- ✅ `getAll()` - Query semua pegawai dari database
- ✅ `getById()` - Query pegawai berdasarkan ID
- ✅ `create()` - Insert data baru dengan validasi
- ✅ `update()` - Update data dengan validasi dinamis
- ✅ `delete()` - Delete data dari database

Fitur:

- PostgreSQL connection pool
- Input validation untuk semua field
- NIP uniqueness check
- Proper error handling
- Column name mapping (no_telepon → noTelepon)

---

## 📋 Step 1: Database Setup

Jalankan SQL script berikut di PostgreSQL client Anda:

### Command:

```bash
psql -U desa-timbukar -d desa-timbukar -f setup-pemerintahan.sql
```

Atau copy-paste langsung ke psql:

```sql
-- Create pemerintahan table
CREATE TABLE IF NOT EXISTS pemerintahan (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  nip VARCHAR(20) UNIQUE NOT NULL,
  no_telepon VARCHAR(15) NOT NULL,
  alamat TEXT NOT NULL,
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pemerintahan_jabatan ON pemerintahan(jabatan);
CREATE INDEX IF NOT EXISTS idx_pemerintahan_nip ON pemerintahan(nip);

-- Insert sample data
INSERT INTO pemerintahan (nama, jabatan, nip, no_telepon, alamat, foto)
VALUES
  ('Budi Santoso', 'Kepala Desa', '123456789012345', '081234567890', 'Jl. Raya Timbukar No. 1', '/images/pemerintahan/budi.jpg'),
  ('Siti Nurhaliza', 'Sekretaris Desa', '123456789012346', '081234567891', 'Jl. Raya Timbukar No. 2', '/images/pemerintahan/siti.jpg'),
  ('Bambang Suryanto', 'Bendahara Desa', '123456789012347', '081234567892', 'Jl. Raya Timbukar No. 3', '/images/pemerintahan/bambang.jpg')
ON CONFLICT DO NOTHING;
```

---

## 🔧 Step 2: Backend Routes (SUDAH ADA)

File: `src/routes/pemerintahan.ts`

Routes sudah dikonfigurasi:

```
GET    /api/pemerintahan           - Get all (public)
GET    /api/pemerintahan/:id       - Get by ID (public)
POST   /api/pemerintahan           - Create (admin only)
PUT    /api/pemerintahan/:id       - Update (admin only)
DELETE /api/pemerintahan/:id       - Delete (admin only)
```

---

## 🧪 Step 3: Test Backend

### Start server:

```bash
npm run dev
```

### Test GET all:

```bash
curl http://localhost:5000/api/pemerintahan
```

Expected response:

```json
{
  "message": "Data pemerintahan desa berhasil didapatkan",
  "data": [
    {
      "id": 1,
      "nama": "Budi Santoso",
      "jabatan": "Kepala Desa",
      "nip": "123456789012345",
      "noTelepon": "081234567890",
      "alamat": "Jl. Raya Timbukar No. 1",
      "foto": "/images/pemerintahan/budi.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Test CREATE (memerlukan token admin):

```bash
curl -X POST http://localhost:5000/api/pemerintahan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "nama": "Ahmad Suryadi",
    "jabatan": "Kaur Pembangunan",
    "nip": "123456789012348",
    "noTelepon": "081234567893",
    "alamat": "Jl. Raya Timbukar No. 4",
    "foto": "/images/pemerintahan/ahmad.jpg"
  }'
```

---

## ✅ Validation Rules

| Field     | Rule                          |
| --------- | ----------------------------- |
| nama      | Required, max 100 chars       |
| jabatan   | Required, max 100 chars       |
| nip       | Required, unique, 15-20 digit |
| noTelepon | Required, 10-15 digit         |
| alamat    | Required, max 500 chars       |
| foto      | Optional, URL format          |

---

## 🔐 Authentication

- **Public routes**: GET / (no auth needed)
- **Protected routes**: POST, PUT, DELETE (need admin token)

Middleware already configured in `src/routes/pemerintahan.ts`

---

## 📝 Field Mapping

Backend ↔ Database ↔ Frontend:

| Frontend  | Database   | Backend Response |
| --------- | ---------- | ---------------- |
| noTelepon | no_telepon | noTelepon        |
| createdAt | created_at | createdAt        |
| updatedAt | updated_at | updatedAt        |

Mapping otomatis di controller query.

---

## 🎯 Next Steps

1. ✅ Database setup complete
2. ✅ Backend controller implemented
3. ⏳ Frontend integration (sudah ready, tinggal test)

Backend siap digunakan oleh frontend!

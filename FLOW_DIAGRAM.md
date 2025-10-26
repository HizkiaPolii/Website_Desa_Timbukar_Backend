# 🎯 FRONTEND-BACKEND FLOW DIAGRAM

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Public Page (/pemerintahan-desa)                               │
│  ├─ Uses: pemerintahanDesaService                              │
│  ├─ Calls: getAllPemerintahan()                                 │
│  └─ Displays: Struktur organisasi grouped by jabatan            │
│                                                                  │
│  Admin Page (/admin/pemerintahan-desa)                          │
│  ├─ Uses: pemerintahanDesaService                              │
│  ├─ CRUD: Create, Read, Update, Delete                         │
│  ├─ Auth: Requires admin token                                  │
│  └─ Features: Form validation, Toast notifications             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           ↓↑ HTTP (JSON)
           ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET    /api/pemerintahan          → getAll()                  │
│  GET    /api/pemerintahan/:id      → getById()                 │
│  POST   /api/pemerintahan          → create()  [Admin]         │
│  PUT    /api/pemerintahan/:id      → update()  [Admin]         │
│  DELETE /api/pemerintahan/:id      → delete()  [Admin]         │
│                                                                  │
│  Middleware:                                                    │
│  ├─ authenticate: Check JWT token                              │
│  └─ adminOnly: Verify admin role                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           ↓↑ PostgreSQL
           ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Table: pemerintahan                                            │
│  ├─ id (Serial PK)                                             │
│  ├─ nama (VARCHAR 100)                                         │
│  ├─ jabatan (VARCHAR 100)                                      │
│  ├─ nip (VARCHAR 20, UNIQUE)                                   │
│  ├─ no_telepon (VARCHAR 15)                                    │
│  ├─ alamat (TEXT)                                              │
│  ├─ foto (VARCHAR 255, nullable)                               │
│  ├─ created_at (TIMESTAMP)                                     │
│  └─ updated_at (TIMESTAMP)                                     │
│                                                                  │
│  Indexes:                                                       │
│  ├─ idx_pemerintahan_jabatan                                   │
│  └─ idx_pemerintahan_nip (UNIQUE)                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### GET All Pegawai

```
Frontend Service
    ↓
GET /api/pemerintahan
    ↓
Backend Controller.getAll()
    ↓
Query: SELECT ... FROM pemerintahan ORDER BY jabatan, nama
    ↓
PostgreSQL Database
    ↓
Return array of Pegawai
    ↓
Frontend: Display in struktur organisasi
```

### CREATE New Pegawai

```
Frontend Form
    ↓
Validate inputs
    ↓
Service.createPemerintahan(data)
    ↓
POST /api/pemerintahan with JWT token
    ↓
Backend: Validate inputs, check NIP unique
    ↓
INSERT into pemerintahan table
    ↓
PostgreSQL: Return new record with ID
    ↓
Frontend: Show success toast + refresh list
```

### UPDATE Pegawai

```
Frontend Form (edit mode)
    ↓
Validate changed fields
    ↓
Service.updatePemerintahan(id, data)
    ↓
PUT /api/pemerintahan/:id with JWT token
    ↓
Backend: Validate inputs, check NIP unique
    ↓
UPDATE pemerintahan WHERE id = $1
    ↓
PostgreSQL: Return updated record
    ↓
Frontend: Show success toast + refresh list
```

### DELETE Pegawai

```
Frontend: Click delete + confirm
    ↓
Service.deletePemerintahan(id)
    ↓
DELETE /api/pemerintahan/:id with JWT token
    ↓
Backend: Check if exists, delete record
    ↓
PostgreSQL: DELETE WHERE id = $1
    ↓
Frontend: Show success toast + refresh list
```

---

## Request/Response Examples

### GET /api/pemerintahan

**Request:**

```bash
GET http://localhost:5000/api/pemerintahan
```

**Response (200 OK):**

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
    },
    {
      "id": 2,
      "nama": "Siti Nurhaliza",
      "jabatan": "Sekretaris Desa",
      "nip": "123456789012346",
      "noTelepon": "081234567891",
      "alamat": "Jl. Raya Timbukar No. 2",
      "foto": "/images/pemerintahan/siti.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/pemerintahan (Create)

**Request:**

```bash
curl -X POST http://localhost:5000/api/pemerintahan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "nama": "Ahmad Suryadi",
    "jabatan": "Kaur Pembangunan",
    "nip": "123456789012348",
    "noTelepon": "081234567893",
    "alamat": "Jl. Raya Timbukar No. 4",
    "foto": "/images/pemerintahan/ahmad.jpg"
  }'
```

**Response (201 Created):**

```json
{
  "message": "Data pemerintahan berhasil dibuat",
  "data": {
    "id": 4,
    "nama": "Ahmad Suryadi",
    "jabatan": "Kaur Pembangunan",
    "nip": "123456789012348",
    "noTelepon": "081234567893",
    "alamat": "Jl. Raya Timbukar No. 4",
    "foto": "/images/pemerintahan/ahmad.jpg",
    "createdAt": "2024-01-15T11:30:45.000Z",
    "updatedAt": "2024-01-15T11:30:45.000Z"
  }
}
```

---

### PUT /api/pemerintahan/:id (Update)

**Request:**

```bash
curl -X PUT http://localhost:5000/api/pemerintahan/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "noTelepon": "081999999999"
  }'
```

**Response (200 OK):**

```json
{
  "message": "Data pemerintahan berhasil diperbarui",
  "data": {
    "id": 1,
    "nama": "Budi Santoso",
    "jabatan": "Kepala Desa",
    "nip": "123456789012345",
    "noTelepon": "081999999999",
    "alamat": "Jl. Raya Timbukar No. 1",
    "foto": "/images/pemerintahan/budi.jpg",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:45:20.000Z"
  }
}
```

---

### DELETE /api/pemerintahan/:id

**Request:**

```bash
curl -X DELETE http://localhost:5000/api/pemerintahan/1 \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK):**

```json
{
  "message": "Data pemerintahan berhasil dihapus",
  "data": {
    "id": 1
  }
}
```

---

## Error Responses

### 400 Bad Request (Validation Error)

```json
{
  "error": "Validasi input gagal",
  "details": {
    "nama": "Nama harus diisi",
    "nip": "NIP harus berisi 15-20 digit angka"
  }
}
```

### 404 Not Found

```json
{
  "error": "Data pemerintahan tidak ditemukan"
}
```

### 409 Conflict (NIP Duplicate)

```json
{
  "error": "NIP sudah terdaftar"
}
```

### 401 Unauthorized

```json
{
  "error": "Token tidak valid atau sudah expired"
}
```

### 500 Server Error

```json
{
  "error": "Gagal memperbarui data pemerintahan",
  "details": "Database connection timeout"
}
```

---

## Status Codes Summary

| Code | Meaning      | When Used                    |
| ---- | ------------ | ---------------------------- |
| 200  | OK           | GET, PUT, DELETE success     |
| 201  | Created      | POST success                 |
| 400  | Bad Request  | Validation error, invalid ID |
| 401  | Unauthorized | Invalid/expired token        |
| 403  | Forbidden    | Not admin                    |
| 404  | Not Found    | Record not found             |
| 409  | Conflict     | NIP duplicate                |
| 500  | Server Error | Database error               |

---

## Environment Configuration

### Backend (.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=desa-timbukar
DB_PASSWORD=admin
DB_NAME=desa-timbukar
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Performance Notes

- ✅ Database indexes on `jabatan` and `nip` untuk fast queries
- ✅ ORDER BY in getAll() untuk consistent ordering
- ✅ Connection pooling dengan max 10 connections
- ✅ Parameterized queries untuk prevent SQL injection
- ✅ Error logging untuk debugging

---

## Security Checklist

- ✅ All sensitive routes protected dengan JWT auth
- ✅ NIP uniqueness enforced di database level
- ✅ Input validation on both client & server
- ✅ Parameterized queries prevent SQL injection
- ✅ Role-based access control (admin only)
- ⚠️ HTTPS recommended untuk production
- ⚠️ CORS configuration may need adjustment
- ⚠️ Rate limiting recommended untuk production

---

Done! Backend siap untuk production. 🚀

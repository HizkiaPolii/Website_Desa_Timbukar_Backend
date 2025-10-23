# Panduan Integrasi Backend dengan Frontend

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Setup Backend](#setup-backend)
3. [Konfigurasi CORS](#konfigurasi-cors)
4. [API Endpoints](#api-endpoints)
5. [Integrasi di Frontend](#integrasi-di-frontend)
6. [Testing Koneksi](#testing-koneksi)

---

## Overview

Anda memiliki:

- **Backend**: Node.js + Express di `d:\KKT\Web-Desa-TImbukar-Backend` (Port 5000)
- **Frontend**: Next.js di `d:\KKT\Web-Desa-Timbukar`

Backend sedang berjalan dengan API REST di `http://localhost:5000/api/`

---

## Setup Backend

### Status Saat Ini ✅

Backend sudah:

- ✅ Ter-konfigurasi dengan TypeScript
- ✅ CORS sudah aktif untuk semua origin
- ✅ Menjalankan di port 5000
- ✅ Database pool siap

### Cara Menjalankan Backend

```bash
cd d:\KKT\Web-Desa-TImbukar-Backend

# Development mode
npm run dev

# Production mode (setelah build)
npm run build
npm start
```

---

## Konfigurasi CORS

CORS di backend sudah dikonfigurasi untuk menerima request dari frontend.

**File**: `src/app.ts`

```typescript
app.use(cors());
```

Ini memungkinkan semua origin mengakses API. Untuk production, ubah menjadi:

```typescript
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);
```

---

## API Endpoints

### 1. Authentication API

**Base URL**: `http://localhost:5000/api/auth`

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin"
  }
}
```

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

#### Get Profile (Protected)

```
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout (Protected)

```
POST /api/auth/logout
Authorization: Bearer {token}
```

---

### 2. Data API Endpoints

#### Profil Desa

```
GET  /api/profil              - Get profil desa
POST /api/profil              - Create profil (admin only)
PUT  /api/profil/:id          - Update profil (admin only)
```

#### Pemerintahan

```
GET  /api/pemerintahan        - Get semua pemerintahan
GET  /api/pemerintahan/:id    - Get pemerintahan by ID
POST /api/pemerintahan        - Create (admin only)
PUT  /api/pemerintahan/:id    - Update (admin only)
```

#### BUMDES

```
GET  /api/bumdes              - Get semua BUMDES
GET  /api/bumdes/:id          - Get BUMDES by ID
POST /api/bumdes              - Create (admin only)
PUT  /api/bumdes/:id          - Update (admin only)
```

#### Lembaga Masyarakat

```
GET  /api/lembaga-masyarakat  - Get semua lembaga
GET  /api/lembaga-masyarakat/:id
POST /api/lembaga-masyarakat  - Create (admin only)
PUT  /api/lembaga-masyarakat/:id - Update (admin only)
```

#### Data Desa

```
GET  /api/data-desa           - Get semua data
GET  /api/data-desa/:id       - Get data by ID
POST /api/data-desa           - Create (admin only)
PUT  /api/data-desa/:id       - Update (admin only)
```

#### Health Check

```
GET /api/health
Response: { "status": "Server is running" }
```

---

## Integrasi di Frontend

### Setup Environment Variables

Di project frontend (`d:\KKT\Web-Desa-Timbukar`), buat file `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Buat API Client Service

**File**: `src/services/api.ts` (atau sesuai struktur project Anda)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic fetch function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Authentication
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, email: string, password: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  getProfile: () => apiCall("/auth/me"),

  logout: () => apiCall("/auth/logout", { method: "POST" }),
};

// Data APIs
export const dataAPI = {
  getProfil: () => apiCall("/profil"),
  updateProfil: (id: string, data: any) =>
    apiCall(`/profil/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  getPemerintahan: () => apiCall("/pemerintahan"),
  getPemerintahanById: (id: string) => apiCall(`/pemerintahan/${id}`),

  getBumdes: () => apiCall("/bumdes"),
  getBumdesById: (id: string) => apiCall(`/bumdes/${id}`),

  getLembagaMasyarakat: () => apiCall("/lembaga-masyarakat"),
  getLembagaMasyarakatById: (id: string) =>
    apiCall(`/lembaga-masyarakat/${id}`),

  getDataDesa: () => apiCall("/data-desa"),
  getDataDesaById: (id: string) => apiCall(`/data-desa/${id}`),
};
```

### Menggunakan API di Komponen

```typescript
"use client";

import { useEffect, useState } from "react";
import { authAPI, dataAPI } from "@/services/api";

export default function ProfilPage() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        const data = await dataAPI.getProfil();
        setProfil(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profil?.namaDesa}</h1>
      <p>{profil?.deskripsi}</p>
    </div>
  );
}
```

### Contoh Login & Token Management

```typescript
"use client";

import { useState } from "react";
import { authAPI } from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(username, password);

      // Simpan token di localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect ke dashboard
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
```

---

## Testing Koneksi

### 1. Test dengan Postman/Thunder Client

1. Import collection ke Postman atau buat request baru
2. Test endpoint `/api/health`:
   ```
   GET http://localhost:5000/api/health
   ```
3. Seharusnya response: `{ "status": "Server is running" }`

### 2. Test Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response akan berisi token JWT.

### 3. Test dengan Browser Console

```javascript
// Cek apakah backend berjalan
fetch("http://localhost:5000/api/health")
  .then((res) => res.json())
  .then((data) => console.log("✅ Backend berjalan:", data))
  .catch((err) => console.error("❌ Backend error:", err));

// Test login
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Token:", data.token);
    localStorage.setItem("token", data.token);
  });
```

---

## Troubleshooting

### Error: "Cannot reach backend"

**Solusi:**

1. Pastikan backend running: `npm run dev` di backend folder
2. Cek port 5000 tidak terpakai aplikasi lain
3. Pastikan firewall tidak memblokir localhost:5000

### Error: CORS

**Solusi:**
Backend sudah dikonfigurasi dengan `cors()` untuk semua origin. Jika masih error:

```typescript
// Di app.ts, ubah menjadi:
import cors from "cors";

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Error: Token Invalid

**Solusi:**

1. Pastikan token disimpan di localStorage setelah login
2. Pastikan token dikirim di header `Authorization: Bearer {token}`
3. Token default di backend adalah "admin123" password untuk user "admin"

---

## Environment Production

### Backend Production

1. Build project:

   ```bash
   npm run build
   ```

2. Update `src/config/database.ts`:

   ```typescript
   export const appConfig = {
     port: parseInt(process.env.PORT || "5000"),
     env: process.env.NODE_ENV || "production",
     jwtSecret: process.env.JWT_SECRET || "your-secure-key-in-production",
     jwtExpire: process.env.JWT_EXPIRE || "7d",
   };
   ```

3. Deploy dengan environment variables

### Frontend Production

Di `.env.production`:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Next Steps

1. ✅ Backend API sudah siap
2. ⏭️ Setup API client di frontend
3. ⏭️ Implementasikan authentication flow
4. ⏭️ Integrasikan setiap halaman dengan API
5. ⏭️ Test semua endpoints
6. ⏭️ Deploy ke production

Butuh bantuan lebih lanjut? Tanya saja! 🚀

# 🚀 QUICK START - Integrasi Backend & Frontend

## Status Backend ✅

- ✅ Backend running di `http://localhost:5000`
- ✅ Database pool initialized
- ✅ CORS enabled untuk semua origin
- ✅ Tidak ada TypeScript error
- ✅ API endpoints ready

## Langkah-Langkah Integrasi (5 Menit)

### Step 1: Buka Terminal Kedua

Backend sudah berjalan di terminal pertama. Buka terminal baru untuk frontend.

```bash
cd d:\KKT\Web-Desa-Timbukar
```

### Step 2: Setup Environment Variable

Buat file `.env.local` di root folder frontend:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Buat API Service

Di project frontend, buat file baru:

**Path**: `src/services/apiClient.ts` (atau disesuaikan dengan struktur)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  error?: string;
  status?: string;
}

interface ApiError extends Error {
  status?: number;
  response?: ApiResponse<any>;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = new Error(
        data.error || `API Error: ${response.status}`
      );
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

export const auth = {
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

  getMe: () => apiCall("/auth/me"),

  logout: () => apiCall("/auth/logout", { method: "POST" }),
};

// ==================== PROFIL DESA ====================

export const profil = {
  get: () => apiCall("/profil"),

  create: (data: any) =>
    apiCall("/profil", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/profil/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==================== PEMERINTAHAN ====================

export const pemerintahan = {
  getAll: () => apiCall("/pemerintahan"),

  getById: (id: string) => apiCall(`/pemerintahan/${id}`),

  create: (data: any) =>
    apiCall("/pemerintahan", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/pemerintahan/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==================== BUMDES ====================

export const bumdes = {
  getAll: () => apiCall("/bumdes"),

  getById: (id: string) => apiCall(`/bumdes/${id}`),

  create: (data: any) =>
    apiCall("/bumdes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/bumdes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==================== LEMBAGA MASYARAKAT ====================

export const lembagaMasyarakat = {
  getAll: () => apiCall("/lembaga-masyarakat"),

  getById: (id: string) => apiCall(`/lembaga-masyarakat/${id}`),

  create: (data: any) =>
    apiCall("/lembaga-masyarakat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/lembaga-masyarakat/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==================== DATA DESA ====================

export const dataDesa = {
  getAll: () => apiCall("/data-desa"),

  getById: (id: string) => apiCall(`/data-desa/${id}`),

  create: (data: any) =>
    apiCall("/data-desa", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/data-desa/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==================== HEALTH CHECK ====================

export const health = {
  check: () => apiCall("/health"),
};
```

### Step 4: Test di Halaman Manapun

Di komponen React/Next.js, gunakan seperti ini:

```typescript
"use client";

import { useEffect, useState } from "react";
import { profil } from "@/services/apiClient";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await profil.get();
        setData(result.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{data?.namaDesa}</h1>
      <p>{data?.deskripsi}</p>
    </div>
  );
}
```

### Step 5: Test Login

```typescript
"use client";

import { useState } from "react";
import { auth } from "@/services/apiClient";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const result = await auth.login(username, password);
      localStorage.setItem("authToken", result.token);
      setMessage("✅ Login berhasil!");
      console.log("User:", result.user);
    } catch (error) {
      setMessage("❌ Login gagal");
      console.error(error);
    }
  };

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

## Testing di Browser

Buka browser console (F12) dan jalankan:

```javascript
// Test backend health
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log("✅ Backend:", d));

// Test login
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" }),
})
  .then((r) => r.json())
  .then((d) => console.log("✅ Token:", d.token));

// Test data
const token = "YOUR_TOKEN_FROM_LOGIN";
fetch("http://localhost:5000/api/profil", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((r) => r.json())
  .then((d) => console.log("✅ Profil:", d.data));
```

## Checklist

- [ ] Backend berjalan dengan `npm run dev`
- [ ] Frontend bisa akses ke `http://localhost:5000/api/health`
- [ ] File `.env.local` sudah dibuat dengan `NEXT_PUBLIC_API_URL`
- [ ] File `apiClient.ts` sudah dibuat
- [ ] Bisa login dengan username: `admin`, password: `admin123`
- [ ] Token tersimpan di localStorage
- [ ] Halaman bisa fetch data dari backend

## Troubleshooting

### "Failed to fetch" atau "CORS Error"

- ✅ Backend running? Cek `http://localhost:5000/api/health` di browser
- ✅ Port 5000 tidak terpakai? Cek dengan `netstat -ano | findstr :5000`

### "Token invalid" atau "Unauthorized"

- ✅ Pastikan token disimpan dengan benar di localStorage
- ✅ Pastikan header `Authorization: Bearer {token}` dikirim

### API Endpoint tidak ditemukan

- Cek apakah route sudah di-import di `app.ts`
- Cek apakah controller method sudah dibuat

---

Selesai! 🎉 Backend dan frontend sekarang terhubung!

Untuk dokumentasi lengkap, lihat: `FRONTEND_INTEGRATION_GUIDE.md`

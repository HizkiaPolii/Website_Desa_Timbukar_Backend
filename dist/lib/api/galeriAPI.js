/**
 * API Service untuk Galeri
 * Digunakan di frontend untuk berkomunikasi dengan backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const galeriAPI = {
    /**
     * Mendapatkan semua galeri dengan pagination, filter, dan search
     */
    async getAll(params) {
        const searchParams = new URLSearchParams();
        if (params?.limit)
            searchParams.append("limit", String(params.limit));
        if (params?.offset)
            searchParams.append("offset", String(params.offset));
        if (params?.kategori)
            searchParams.append("kategori", params.kategori);
        if (params?.search)
            searchParams.append("search", params.search);
        const queryString = searchParams.toString();
        const url = queryString
            ? `${API_BASE_URL}/galeri?${queryString}`
            : `${API_BASE_URL}/galeri`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal mengambil data galeri");
        }
        return response.json();
    },
    /**
     * Mendapatkan galeri berdasarkan ID
     */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/galeri/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal mengambil data galeri");
        }
        return response.json();
    },
    /**
     * Mendapatkan daftar kategori
     */
    async getKategoriList() {
        const response = await fetch(`${API_BASE_URL}/galeri/kategori/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal mengambil data kategori");
        }
        return response.json();
    },
    /**
     * Membuat galeri baru
     */
    async create(data) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/galeri`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal membuat galeri");
        }
        return response.json();
    },
    /**
     * Update galeri
     */
    async update(id, data) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/galeri/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal update galeri");
        }
        return response.json();
    },
    /**
     * Hapus galeri
     */
    async delete(id) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/galeri/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Gagal hapus galeri");
        }
        return response.json();
    },
};
//# sourceMappingURL=galeriAPI.js.map
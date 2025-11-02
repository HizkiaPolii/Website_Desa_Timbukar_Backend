/**
 * API Service untuk Galeri
 * Digunakan di frontend untuk berkomunikasi dengan backend
 */
interface Galeri {
    id: number;
    judul: string;
    deskripsi?: string;
    gambar: string;
    kategori: string;
    created_at: string;
    updated_at: string;
}
interface GetGaleriResponse {
    message: string;
    data: Galeri[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        pages: number;
    };
}
interface SingleGaleriResponse {
    message: string;
    data: Galeri;
}
interface KategoriListResponse {
    message: string;
    data: string[];
}
export declare const galeriAPI: {
    /**
     * Mendapatkan semua galeri dengan pagination, filter, dan search
     */
    getAll(params?: {
        limit?: number;
        offset?: number;
        kategori?: string;
        search?: string;
    }): Promise<GetGaleriResponse>;
    /**
     * Mendapatkan galeri berdasarkan ID
     */
    getById(id: number): Promise<SingleGaleriResponse>;
    /**
     * Mendapatkan daftar kategori
     */
    getKategoriList(): Promise<KategoriListResponse>;
    /**
     * Membuat galeri baru
     */
    create(data: {
        judul: string;
        deskripsi?: string;
        gambar: string;
        kategori: string;
    }): Promise<SingleGaleriResponse>;
    /**
     * Update galeri
     */
    update(id: number, data: {
        judul?: string;
        deskripsi?: string;
        gambar?: string;
        kategori?: string;
    }): Promise<SingleGaleriResponse>;
    /**
     * Hapus galeri
     */
    delete(id: number): Promise<SingleGaleriResponse>;
};
export {};
//# sourceMappingURL=galeriAPI.d.ts.map
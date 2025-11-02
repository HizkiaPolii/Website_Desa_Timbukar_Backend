interface Galeri {
    id: number;
    judul: string;
    deskripsi?: string;
    gambar: string;
    kategori: string;
    created_at: string;
    updated_at: string;
}
interface CreateGaleriInput {
    judul: string;
    deskripsi?: string;
    gambar: string;
    kategori: string;
}
interface UpdateGaleriInput {
    judul?: string;
    deskripsi?: string;
    gambar?: string;
    kategori?: string;
}
export declare class GaleriService {
    /**
     * Mendapatkan semua galeri dengan pagination, filter, dan search
     */
    getAllGaleri(limit?: number, offset?: number, kategori?: string, search?: string): Promise<{
        data: Galeri[];
        total: number;
    }>;
    /**
     * Mendapatkan galeri berdasarkan ID
     */
    getGaleriById(id: number): Promise<Galeri | null>;
    /**
     * Membuat galeri baru
     */
    createGaleri(input: CreateGaleriInput): Promise<Galeri>;
    /**
     * Update galeri
     */
    updateGaleri(id: number, input: UpdateGaleriInput): Promise<Galeri>;
    /**
     * Hapus galeri
     */
    deleteGaleri(id: number): Promise<Galeri>;
    /**
     * Mendapatkan daftar kategori yang tersedia
     */
    getKategoriList(): Promise<string[]>;
}
export {};
//# sourceMappingURL=galeriService.d.ts.map
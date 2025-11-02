export interface BumdesData {
    id: number;
    nama_bumdes: string;
    deskripsi: string;
    jenis_usaha: string;
    alamat: string;
    no_telepon: string;
    pimpinan: string;
    gambar: string;
    created_at: Date;
    updated_at: Date;
}
export declare class BumdesService {
    /**
     * Mendapatkan semua data BUMDES
     */
    getAll(): Promise<BumdesData[]>;
    /**
     * Mendapatkan BUMDES berdasarkan ID
     */
    getById(id: number): Promise<BumdesData | null>;
    /**
     * Membuat data BUMDES baru
     */
    create(data: Omit<BumdesData, "id" | "created_at" | "updated_at">): Promise<BumdesData>;
    /**
     * Update data BUMDES
     */
    update(id: number, data: Partial<Omit<BumdesData, "id" | "created_at" | "updated_at">>): Promise<BumdesData | null>;
    /**
     * Menghapus data BUMDES
     */
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=bumdesService.d.ts.map
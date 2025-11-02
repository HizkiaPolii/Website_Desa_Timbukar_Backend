export interface Kontak {
    id?: number;
    nama: string;
    email: string;
    no_telepon: string;
    subjek: string;
    pesan: string;
    status?: string;
    created_at?: Date;
}
export declare const createKontak: (kontak: Kontak) => Promise<Kontak>;
export declare const getAllKontak: (page?: number, limit?: number, search?: string, status?: string) => Promise<{
    data: Kontak[];
    total: number;
    page: number;
    limit: number;
}>;
export declare const getKontakById: (id: number) => Promise<Kontak | null>;
export declare const updateKontakStatus: (id: number, status: string) => Promise<Kontak | null>;
export declare const deleteKontak: (id: number) => Promise<boolean>;
export declare const getKontakStats: () => Promise<any>;
//# sourceMappingURL=kontakService.d.ts.map
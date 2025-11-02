export interface ApbdesItem {
    id: number;
    tahun: number;
    keterangan: string;
    pendapatan: number;
    belanja: number;
    pembiayaan: number;
    file_dokumen: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface CreateApbdesInput {
    tahun: number;
    keterangan: string;
    pendapatan: number;
    belanja: number;
    pembiayaan: number;
    file_dokumen?: string;
}
export interface UpdateApbdesInput {
    tahun?: number;
    keterangan?: string;
    pendapatan?: number;
    belanja?: number;
    pembiayaan?: number;
    file_dokumen?: string;
}
export declare class ApbdesService {
    getAll(): Promise<ApbdesItem[]>;
    getById(id: number): Promise<ApbdesItem | null>;
    getByTahun(tahun: number): Promise<ApbdesItem | null>;
    create(input: CreateApbdesInput): Promise<ApbdesItem>;
    update(id: number, input: UpdateApbdesInput): Promise<ApbdesItem>;
    delete(id: number): Promise<boolean>;
    getSummary(tahun: number): Promise<any>;
}
//# sourceMappingURL=apbdesService.d.ts.map
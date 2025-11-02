import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare class GaleriController {
    /**
     * GET /api/galeri
     * Mendapatkan semua galeri dengan pagination, filter, dan search
     */
    getAllGaleri(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/galeri/:id
     * Mendapatkan galeri berdasarkan ID
     */
    getGaleriById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/galeri/kategori/list
     * Mendapatkan daftar kategori yang tersedia
     */
    getKategoriList(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/galeri
     * Membuat galeri baru
     */
    createGaleri(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * PUT /api/galeri/:id
     * Update galeri
     */
    updateGaleri(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * DELETE /api/galeri/:id
     * Hapus galeri
     */
    deleteGaleri(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=galeriController.d.ts.map
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { GaleriService } from "../services/galeriService.js";

const galeriService = new GaleriService();

export class GaleriController {
  /**
   * GET /api/galeri
   * Mendapatkan semua galeri dengan pagination, filter, dan search
   */
  async getAllGaleri(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const kategori = req.query.kategori as string | undefined;
      const search = req.query.search as string | undefined;

      // Validasi pagination
      if (limit < 1 || offset < 0) {
        return res.status(400).json({
          error: "Parameter limit harus > 0 dan offset >= 0",
        });
      }

      const { data, total } = await galeriService.getAllGaleri(
        limit,
        offset,
        kategori,
        search
      );

      return res.status(200).json({
        message: "Data galeri berhasil diambil",
        data,
        pagination: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error in getAllGaleri:", error);
      return res.status(500).json({
        error: "Gagal mengambil data galeri",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/galeri/:id
   * Mendapatkan galeri berdasarkan ID
   */
  async getGaleriById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          error: "ID tidak valid",
        });
      }

      const galeri = await galeriService.getGaleriById(Number(id));

      if (!galeri) {
        return res.status(404).json({
          error: "Galeri tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Data galeri berhasil diambil",
        data: galeri,
      });
    } catch (error) {
      console.error("Error in getGaleriById:", error);
      return res.status(500).json({
        error: "Gagal mengambil data galeri",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/galeri/kategori/list
   * Mendapatkan daftar kategori yang tersedia
   */
  async getKategoriList(req: AuthenticatedRequest, res: Response) {
    try {
      const kategoriList = await galeriService.getKategoriList();

      return res.status(200).json({
        message: "Data kategori berhasil diambil",
        data: kategoriList,
      });
    } catch (error) {
      console.error("Error in getKategoriList:", error);
      return res.status(500).json({
        error: "Gagal mengambil data kategori",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * POST /api/galeri
   * Membuat galeri baru
   */
  async createGaleri(req: AuthenticatedRequest, res: Response) {
    try {
      const { judul, deskripsi, gambar, kategori } = req.body;

      // Validasi input
      if (!judul || !gambar || !kategori) {
        return res.status(400).json({
          error: "Validasi gagal",
          message: "judul, gambar, dan kategori harus diisi",
        });
      }

      const newGaleri = await galeriService.createGaleri({
        judul,
        deskripsi,
        gambar,
        kategori,
      });

      return res.status(201).json({
        message: "Galeri berhasil dibuat",
        data: newGaleri,
      });
    } catch (error) {
      console.error("Error in createGaleri:", error);
      return res.status(500).json({
        error: "Gagal membuat galeri",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * PUT /api/galeri/:id
   * Update galeri
   */
  async updateGaleri(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { judul, deskripsi, gambar, kategori } = req.body;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          error: "ID tidak valid",
        });
      }

      const updatedGaleri = await galeriService.updateGaleri(Number(id), {
        judul,
        deskripsi,
        gambar,
        kategori,
      });

      return res.status(200).json({
        message: "Galeri berhasil diupdate",
        data: updatedGaleri,
      });
    } catch (error) {
      console.error("Error in updateGaleri:", error);

      if (
        error instanceof Error &&
        error.message === "Galeri tidak ditemukan"
      ) {
        return res.status(404).json({
          error: "Galeri tidak ditemukan",
        });
      }

      if (
        error instanceof Error &&
        error.message === "Tidak ada field untuk diupdate"
      ) {
        return res.status(400).json({
          error: "Tidak ada field untuk diupdate",
        });
      }

      return res.status(500).json({
        error: "Gagal mengupdate galeri",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * DELETE /api/galeri/:id
   * Hapus galeri
   */
  async deleteGaleri(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          error: "ID tidak valid",
        });
      }

      const deletedGaleri = await galeriService.deleteGaleri(Number(id));

      return res.status(200).json({
        message: "Galeri berhasil dihapus",
        data: deletedGaleri,
      });
    } catch (error) {
      console.error("Error in deleteGaleri:", error);

      if (
        error instanceof Error &&
        error.message === "Galeri tidak ditemukan"
      ) {
        return res.status(404).json({
          error: "Galeri tidak ditemukan",
        });
      }

      return res.status(500).json({
        error: "Gagal menghapus galeri",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

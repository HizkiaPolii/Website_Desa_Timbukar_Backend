import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export class DataDesaController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      // TODO: Query database untuk mendapatkan semua data desa
      const dataDesa = [
        {
          id: 1,
          kategori: "Kependudukan",
          jumlahPenduduk: 8500,
          jumlahKepalaKeluarga: 1700,
          laki_laki: 4200,
          perempuan: 4300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kategori: "Pendidikan",
          totalSekolah: 5,
          tingkatTamat: "SMA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return res.status(200).json({
        message: "Data desa berhasil didapatkan",
        data: dataDesa,
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal mendapatkan data desa" });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Query database berdasarkan ID

      return res.status(200).json({
        message: "Data desa berhasil didapatkan",
        data: {
          id,
          kategori: "Kependudukan",
          jumlahPenduduk: 8500,
          jumlahKepalaKeluarga: 1700,
          laki_laki: 4200,
          perempuan: 4300,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal mendapatkan data desa" });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { kategori, ...dataFields } = req.body;

      // TODO: Validasi input
      // TODO: Simpan ke database

      return res.status(201).json({
        message: "Data desa berhasil dibuat",
        data: {
          id: 1,
          kategori,
          ...dataFields,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal membuat data desa" });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { kategori, ...dataFields } = req.body;

      // TODO: Validasi input
      // TODO: Update database

      return res.status(200).json({
        message: "Data desa berhasil diperbarui",
        data: {
          id,
          kategori,
          ...dataFields,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal memperbarui data desa" });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Hapus dari database

      return res.status(200).json({
        message: "Data desa berhasil dihapus",
        data: {
          id,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal menghapus data desa" });
    }
  }
}

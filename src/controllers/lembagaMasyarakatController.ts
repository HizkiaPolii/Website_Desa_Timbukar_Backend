import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export class LembagaMasyarakatController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      // TODO: Query database untuk mendapatkan semua data lembaga masyarakat
      const lembagaMasyarakat = [
        {
          id: 1,
          nama: "PKK Timbukar",
          deskripsi: "Pemberdayaan Kesejahteraan Keluarga",
          jenisLembaga: "Sosial Kemasyarakatan",
          ketua: "Siti Nurhaliza",
          visi: "Memberdayakan keluarga untuk hidup sejahtera",
          misi: "Memberikan pelatihan keterampilan kepada keluarga",
          kontakPerson: "081234567890",
          email: "pkk@timbukar.desa.id",
          alamat: "Jl. Raya Timbukar No. 3",
          tahunBerdiri: 2015,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return res.status(200).json({
        message: "Data lembaga masyarakat berhasil didapatkan",
        data: lembagaMasyarakat,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal mendapatkan data lembaga masyarakat" });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Query database berdasarkan ID

      return res.status(200).json({
        message: "Data lembaga masyarakat berhasil didapatkan",
        data: {
          id,
          nama: "PKK Timbukar",
          deskripsi: "Pemberdayaan Kesejahteraan Keluarga",
          jenisLembaga: "Sosial Kemasyarakatan",
          ketua: "Siti Nurhaliza",
          visi: "Memberdayakan keluarga untuk hidup sejahtera",
          misi: "Memberikan pelatihan keterampilan kepada keluarga",
          kontakPerson: "081234567890",
          email: "pkk@timbukar.desa.id",
          alamat: "Jl. Raya Timbukar No. 3",
          tahunBerdiri: 2015,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal mendapatkan data lembaga masyarakat" });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        nama,
        deskripsi,
        jenisLembaga,
        ketua,
        visi,
        misi,
        kontakPerson,
        email,
        alamat,
        tahunBerdiri,
      } = req.body;

      // TODO: Validasi input
      // TODO: Simpan ke database

      return res.status(201).json({
        message: "Data lembaga masyarakat berhasil dibuat",
        data: {
          id: 1,
          nama,
          deskripsi,
          jenisLembaga,
          ketua,
          visi,
          misi,
          kontakPerson,
          email,
          alamat,
          tahunBerdiri,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal membuat data lembaga masyarakat" });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        nama,
        deskripsi,
        jenisLembaga,
        ketua,
        visi,
        misi,
        kontakPerson,
        email,
        alamat,
        tahunBerdiri,
      } = req.body;

      // TODO: Validasi input
      // TODO: Update database

      return res.status(200).json({
        message: "Data lembaga masyarakat berhasil diperbarui",
        data: {
          id,
          nama,
          deskripsi,
          jenisLembaga,
          ketua,
          visi,
          misi,
          kontakPerson,
          email,
          alamat,
          tahunBerdiri,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal memperbarui data lembaga masyarakat" });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Hapus dari database

      return res.status(200).json({
        message: "Data lembaga masyarakat berhasil dihapus",
        data: {
          id,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal menghapus data lembaga masyarakat" });
    }
  }
}

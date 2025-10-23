import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export class PemerintahanDesaController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      // TODO: Query database untuk mendapatkan semua data pemerintahan
      const pemerintahans = [
        {
          id: 1,
          nama: "Budi Santoso",
          jabatan: "Kepala Desa",
          nip: "123456789",
          periodePeriod: "2021-2026",
          alamat: "Jl. Raya Timbukar No. 1",
          telepon: "081234567890",
          email: "budi@desa.id",
          pendidikan: "S1 Administrasi Publik",
          agama: "Islam",
          jenisKelamin: "Laki-laki",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return res.status(200).json({
        message: "Data pemerintahan desa berhasil didapatkan",
        data: pemerintahans,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal mendapatkan data pemerintahan" });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Query database berdasarkan ID

      return res.status(200).json({
        message: "Data pemerintahan desa berhasil didapatkan",
        data: {
          id,
          nama: "Budi Santoso",
          jabatan: "Kepala Desa",
          nip: "123456789",
          periode: "2021-2026",
          alamat: "Jl. Raya Timbukar No. 1",
          telepon: "081234567890",
          email: "budi@desa.id",
          pendidikan: "S1 Administrasi Publik",
          agama: "Islam",
          jenisKelamin: "Laki-laki",
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal mendapatkan data pemerintahan" });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        nama,
        jabatan,
        nip,
        periode,
        alamat,
        telepon,
        email,
        pendidikan,
        agama,
        jenisKelamin,
      } = req.body;

      // TODO: Validasi input
      // TODO: Simpan ke database

      return res.status(201).json({
        message: "Data pemerintahan berhasil dibuat",
        data: {
          id: 1,
          nama,
          jabatan,
          nip,
          periode,
          alamat,
          telepon,
          email,
          pendidikan,
          agama,
          jenisKelamin,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal membuat data pemerintahan" });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        nama,
        jabatan,
        nip,
        periode,
        alamat,
        telepon,
        email,
        pendidikan,
        agama,
        jenisKelamin,
      } = req.body;

      // TODO: Validasi input
      // TODO: Update database

      return res.status(200).json({
        message: "Data pemerintahan berhasil diperbarui",
        data: {
          id,
          nama,
          jabatan,
          nip,
          periode,
          alamat,
          telepon,
          email,
          pendidikan,
          agama,
          jenisKelamin,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal memperbarui data pemerintahan" });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Hapus dari database

      return res.status(200).json({
        message: "Data pemerintahan berhasil dihapus",
        data: {
          id,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Gagal menghapus data pemerintahan" });
    }
  }
}

import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export class ProfilDesaController {
  async getProfil(req: AuthenticatedRequest, res: Response) {
    try {
      // TODO: Query database untuk mendapatkan profil desa
      const profil = {
        id: 1,
        namaDesa: "Timbukar",
        provinsi: "Nusa Tenggara Barat",
        kabupaten: "Lombok Timur",
        kecamatan: "Selong",
        luasWilayah: "45.50 km²",
        jumlahPenduduk: 8500,
        deskripsi: "Desa yang indah dengan keindahan alam yang memukau",
        website: "https://timbukar.desa.id",
        telepon: "(0376) 123456",
        email: "admin@timbukar.desa.id",
        alamat: "Jl. Raya Timbukar No. 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return res.status(200).json({
        message: "Data profil desa berhasil didapatkan",
        data: profil,
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal mendapatkan profil desa" });
    }
  }

  async updateProfil(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        namaDesa,
        provinsi,
        kabupaten,
        kecamatan,
        luasWilayah,
        jumlahPenduduk,
        deskripsi,
        website,
        telepon,
        email,
        alamat,
      } = req.body;

      // TODO: Validasi input data
      // TODO: Update database

      return res.status(200).json({
        message: "Profil desa berhasil diperbarui",
        data: {
          id,
          namaDesa,
          provinsi,
          kabupaten,
          kecamatan,
          luasWilayah,
          jumlahPenduduk,
          deskripsi,
          website,
          telepon,
          email,
          alamat,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal memperbarui profil desa" });
    }
  }

  async createProfil(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        namaDesa,
        provinsi,
        kabupaten,
        kecamatan,
        luasWilayah,
        jumlahPenduduk,
        deskripsi,
        website,
        telepon,
        email,
        alamat,
      } = req.body;

      // TODO: Validasi input data
      // TODO: Simpan ke database

      return res.status(201).json({
        message: "Profil desa berhasil dibuat",
        data: {
          id: 1,
          namaDesa,
          provinsi,
          kabupaten,
          kecamatan,
          luasWilayah,
          jumlahPenduduk,
          deskripsi,
          website,
          telepon,
          email,
          alamat,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal membuat profil desa" });
    }
  }
}

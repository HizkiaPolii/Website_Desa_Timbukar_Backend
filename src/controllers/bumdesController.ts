import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { BumdesService } from "../services/bumdesService.js";

export class BumdesController {
  private bumdesService: BumdesService;

  constructor() {
    this.bumdesService = new BumdesService();
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const bumdes = await this.bumdesService.getAll();

      return res.status(200).json({
        message: "Data BUMDES berhasil didapatkan",
        data: bumdes,
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      return res.status(500).json({ error: "Gagal mendapatkan data BUMDES" });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID tidak valid" });
      }

      const bumdes = await this.bumdesService.getById(parseInt(id));

      if (!bumdes) {
        return res.status(404).json({ error: "BUMDES tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Data BUMDES berhasil didapatkan",
        data: bumdes,
      });
    } catch (error) {
      console.error("Error in getById:", error);
      return res.status(500).json({ error: "Gagal mendapatkan data BUMDES" });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        nama_bumdes,
        deskripsi,
        jenis_usaha,
        alamat,
        no_telepon,
        pimpinan,
        gambar,
      } = req.body;

      // Validasi input
      if (!nama_bumdes || !deskripsi || !jenis_usaha || !alamat) {
        return res.status(400).json({
          error:
            "Field wajib diisi: nama_bumdes, deskripsi, jenis_usaha, alamat",
        });
      }

      // ✅ Validasi gambar (harus string path, bukan file binary)
      if (gambar) {
        if (typeof gambar !== "string") {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_type",
            message: "Gambar harus berupa string path URL",
            received: typeof gambar,
          });
        }

        // Normalize gambar path: extract path dari full URL jika ada
        let normalizedGambar = gambar;
        if (gambar.startsWith("http")) {
          // Extract pathname dari full URL
          // https://api.desatimbukar.id/uploads/bumdes/xxx.jpg -> /uploads/bumdes/xxx.jpg
          try {
            const url = new URL(gambar);
            normalizedGambar = url.pathname;
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: "invalid_gambar_url",
              message: "URL gambar tidak valid",
              received: gambar,
            });
          }
        }

        // Validasi format path (harus dimulai dengan "/" atau berupa full URL)
        if (!normalizedGambar.startsWith("/")) {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_format",
            message:
              "Path gambar harus dimulai dengan '/' atau berupa full URL (contoh: /images/bumdes/xxx.jpg atau https://api.desatimbukar.id/uploads/bumdes/xxx.jpg)",
            received: gambar,
          });
        }

        // Validasi path mengandung folder yang valid
        const validFolders = [
          "images/bumdes",
          "images/pemerintahan",
          "images/galeri",
          "images/general",
          "uploads/bumdes",
          "uploads/pemerintahan",
          "uploads/galeri",
          "uploads/general",
        ];
        const isValidFolder = validFolders.some((folder) =>
          normalizedGambar.includes(folder)
        );
        if (!isValidFolder) {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_folder",
            message: `Path gambar harus berada di salah satu folder: ${validFolders.join(
              ", "
            )}`,
            received: gambar,
          });
        }
      }

      const newBumdes = await this.bumdesService.create({
        nama_bumdes,
        deskripsi,
        jenis_usaha,
        alamat,
        no_telepon: no_telepon || "",
        pimpinan: pimpinan || "",
        gambar: gambar || "",
      });

      return res.status(201).json({
        success: true,
        message: "Data BUMDES berhasil dibuat",
        data: newBumdes,
      });
    } catch (error) {
      console.error("Error in create:", error);
      return res.status(500).json({
        success: false,
        error: "Gagal membuat data BUMDES",
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID tidak valid" });
      }

      const bumdesId = parseInt(id);

      // Check if bumdes exists
      const existingBumdes = await this.bumdesService.getById(bumdesId);
      if (!existingBumdes) {
        return res.status(404).json({ error: "BUMDES tidak ditemukan" });
      }

      const updateData = req.body;

      // Validasi minimal satu field untuk update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: "Minimal satu field harus diupdate",
        });
      }

      // ✅ Validasi gambar jika ada (harus string path, bukan file binary)
      if (updateData.gambar) {
        if (typeof updateData.gambar !== "string") {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_type",
            message: "Gambar harus berupa string path URL",
            received: typeof updateData.gambar,
          });
        }

        // Normalize gambar path: extract path dari full URL jika ada
        let normalizedGambar = updateData.gambar;
        if (updateData.gambar.startsWith("http")) {
          // Extract pathname dari full URL
          // https://api.desatimbukar.id/uploads/bumdes/xxx.jpg -> /uploads/bumdes/xxx.jpg
          try {
            const url = new URL(updateData.gambar);
            normalizedGambar = url.pathname;
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: "invalid_gambar_url",
              message: "URL gambar tidak valid",
              received: updateData.gambar,
            });
          }
        }

        // Validasi format path (harus dimulai dengan "/" atau berupa full URL)
        if (!normalizedGambar.startsWith("/")) {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_format",
            message:
              "Path gambar harus dimulai dengan '/' atau berupa full URL (contoh: /images/bumdes/xxx.jpg atau https://api.desatimbukar.id/uploads/bumdes/xxx.jpg)",
            received: updateData.gambar,
          });
        }

        // Validasi path mengandung folder yang valid
        const validFolders = [
          "images/bumdes",
          "images/pemerintahan",
          "images/galeri",
          "images/general",
          "uploads/bumdes",
          "uploads/pemerintahan",
          "uploads/galeri",
          "uploads/general",
        ];
        const isValidFolder = validFolders.some((folder) =>
          normalizedGambar.includes(folder)
        );
        if (!isValidFolder) {
          return res.status(400).json({
            success: false,
            error: "invalid_gambar_folder",
            message: `Path gambar harus berada di salah satu folder: ${validFolders.join(
              ", "
            )}`,
            received: updateData.gambar,
          });
        }
      }

      const updatedBumdes = await this.bumdesService.update(
        bumdesId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Data BUMDES berhasil diperbarui",
        data: updatedBumdes,
      });
    } catch (error) {
      console.error("Error in update:", error);
      return res.status(500).json({
        success: false,
        error: "Gagal memperbarui data BUMDES",
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID tidak valid" });
      }

      const bumdesId = parseInt(id);

      // Check if bumdes exists
      const existingBumdes = await this.bumdesService.getById(bumdesId);
      if (!existingBumdes) {
        return res.status(404).json({ error: "BUMDES tidak ditemukan" });
      }

      const isDeleted = await this.bumdesService.delete(bumdesId);

      if (!isDeleted) {
        return res.status(500).json({ error: "Gagal menghapus data BUMDES" });
      }

      return res.status(200).json({
        message: "Data BUMDES berhasil dihapus",
        data: {
          id: bumdesId,
        },
      });
    } catch (error) {
      console.error("Error in delete:", error);
      return res.status(500).json({ error: "Gagal menghapus data BUMDES" });
    }
  }
}

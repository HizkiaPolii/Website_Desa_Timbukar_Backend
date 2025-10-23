import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { generateToken } from "../config/jwt.js";

export class AuthController {
  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username dan password diperlukan" });
      }

      // TODO: Query database untuk verifikasi user
      // Untuk sementara menggunakan data dummy
      const user = {
        id: "1",
        username: username,
        role: "admin" as const,
      };

      // Verifikasi password (gunakan bcrypt di production)
      if (password !== "admin123") {
        return res.status(401).json({ error: "Password tidak valid" });
      }

      const token = generateToken(user);
      return res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal login" });
    }
  }

  async register(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ error: "Username, password, dan email diperlukan" });
      }

      // TODO: Check apakah user sudah terdaftar
      // TODO: Hash password dengan bcrypt
      // TODO: Simpan ke database

      return res.status(201).json({
        message: "Pendaftaran berhasil",
        user: {
          username,
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal mendaftar" });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      // Token biasanya di-handle di frontend (dihapus dari localStorage)
      // Backend bisa melakukan logout logic jika diperlukan

      return res.status(200).json({ message: "Logout berhasil" });
    } catch (error) {
      return res.status(500).json({ error: "Gagal logout" });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "User tidak ditemukan" });
      }

      return res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({ error: "Gagal mendapatkan profil" });
    }
  }
}

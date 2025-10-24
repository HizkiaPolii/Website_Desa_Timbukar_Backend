import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";
import { getPool } from "../config/connectionPool.js";

export class AuthController {
  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username dan password diperlukan" });
      }

      // Query database untuk verifikasi user
      const pool = getPool();
      const result = await pool.query(
        "SELECT id, username, password, role FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ error: "Username atau password tidak valid" });
      }

      const userFromDb = result.rows[0];

      // Verifikasi password dengan bcrypt
      const passwordMatch = await bcrypt.compare(password, userFromDb.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: "Username atau password tidak valid" });
      }

      const user = {
        id: String(userFromDb.id),
        username: userFromDb.username,
        role: userFromDb.role as "admin" | "user",
      };

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
      console.error("Login error:", error);
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

      // Validasi panjang password
      if (password.length < 6) {
        return res.status(400).json({ error: "Password minimal 6 karakter" });
      }

      const pool = getPool();

      // Check apakah user sudah terdaftar
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE username = $1 OR email = $2",
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Username atau email sudah terdaftar" });
      }

      // Hash password dengan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan ke database
      const result = await pool.query(
        "INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
        [username, hashedPassword, email, "user"]
      );

      const newUser = result.rows[0];

      return res.status(201).json({
        message: "Pendaftaran berhasil",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
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

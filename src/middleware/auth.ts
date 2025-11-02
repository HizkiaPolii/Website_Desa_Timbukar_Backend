import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: "admin" | "user";
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = (authHeader as string)?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

export function adminOnly(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Akses ditolak. Hanya admin yang diizinkan" });
  }
  next();
}

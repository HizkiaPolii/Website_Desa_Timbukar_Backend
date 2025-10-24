import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { appConfig } from "./database.js";

export interface JwtPayload {
  id: string;
  username: string;
  role: "admin" | "user";
}

export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, appConfig.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, appConfig.jwtSecret) as JwtPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

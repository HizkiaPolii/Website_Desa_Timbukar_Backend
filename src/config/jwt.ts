import * as jwt from "jsonwebtoken";
import { appConfig } from "./database.js";

export interface JwtPayload {
  id: string;
  username: string;
  role: "admin" | "user";
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    appConfig.jwtSecret as string,
    {
      expiresIn: appConfig.jwtExpire as string,
    } as jwt.SignOptions
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, appConfig.jwtSecret as string, {}) as JwtPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

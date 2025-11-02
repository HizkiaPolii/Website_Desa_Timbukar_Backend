import { verifyToken } from "../config/jwt.js";
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token tidak ditemukan" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "Token tidak valid" });
    }
}
export function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({ error: "Akses ditolak. Hanya admin yang diizinkan" });
    }
    next();
}
//# sourceMappingURL=auth.js.map
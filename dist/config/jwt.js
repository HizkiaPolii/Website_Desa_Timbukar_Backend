import jwt from "jsonwebtoken";
import { appConfig } from "./database.js";
export function generateToken(payload) {
    const options = {
        expiresIn: "7d",
    };
    return jwt.sign(payload, appConfig.jwtSecret, options);
}
export function verifyToken(token) {
    return jwt.verify(token, appConfig.jwtSecret);
}
export function decodeToken(token) {
    try {
        return jwt.decode(token);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map
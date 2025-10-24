import dotenv from "dotenv";
dotenv.config();
export const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "desa-timbukar",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "desa-timbukar",
};
export const appConfig = {
    port: parseInt(process.env.PORT || "5000"),
    env: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpire: process.env.JWT_EXPIRE || "7d",
};
//# sourceMappingURL=database.js.map
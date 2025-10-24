import { Pool } from "pg";
import { dbConfig } from "./database.js";
let pool;
export async function initializeDatabase() {
    pool = new Pool({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    try {
        const client = await pool.connect();
        console.log("✅ Database pool created successfully");
        console.log(`Connected to PostgreSQL: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
        client.release();
    }
    catch (err) {
        console.error("❌ Failed to connect to database:", err);
        throw err;
    }
    return pool;
}
export function getPool() {
    if (!pool) {
        throw new Error("Database pool not initialized");
    }
    return pool;
}
export async function closeDatabase() {
    if (pool) {
        await pool.end();
        console.log("Database connection closed");
    }
}
//# sourceMappingURL=connectionPool.js.map
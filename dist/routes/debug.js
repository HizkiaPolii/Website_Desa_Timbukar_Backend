import { Router } from "express";
import { getPool } from "../config/connectionPool.js";
const router = Router();
// Debug endpoint - check database connection
router.get("/health", async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({
            status: "✅ Database connected",
            timestamp: result.rows[0].now,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "❌ Database connection failed",
            error: error.message,
        });
    }
});
// Debug endpoint - check tables
router.get("/tables", async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name LIKE 'desa_%'
    `);
        res.status(200).json({
            status: "✅ Tables found",
            tables: result.rows.map((row) => row.table_name),
            count: result.rows.length,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "❌ Failed to fetch tables",
            error: error.message,
        });
    }
});
// Debug endpoint - get data counts
router.get("/data-count", async (req, res) => {
    try {
        const pool = getPool();
        const [stats, demographics, gender, education, religion] = await Promise.all([
            pool.query("SELECT COUNT(*) as count FROM desa_statistics"),
            pool.query("SELECT COUNT(*) as count FROM desa_demographics"),
            pool.query("SELECT COUNT(*) as count FROM desa_gender"),
            pool.query("SELECT COUNT(*) as count FROM desa_education"),
            pool.query("SELECT COUNT(*) as count FROM desa_religion"),
        ]);
        res.status(200).json({
            status: "✅ Data counts",
            statistics: parseInt(stats.rows[0].count),
            demographics: parseInt(demographics.rows[0].count),
            gender: parseInt(gender.rows[0].count),
            education: parseInt(education.rows[0].count),
            religion: parseInt(religion.rows[0].count),
        });
    }
    catch (error) {
        res.status(500).json({
            status: "❌ Failed to get data counts",
            error: error.message,
        });
    }
});
// Debug endpoint - get all data
router.get("/all", async (req, res) => {
    try {
        const pool = getPool();
        const [stats, demographics, gender, education, religion] = await Promise.all([
            pool.query("SELECT * FROM desa_statistics"),
            pool.query("SELECT * FROM desa_demographics"),
            pool.query("SELECT * FROM desa_gender"),
            pool.query("SELECT * FROM desa_education"),
            pool.query("SELECT * FROM desa_religion"),
        ]);
        res.status(200).json({
            status: "✅ All data retrieved",
            data: {
                statistics: stats.rows,
                demographics: demographics.rows,
                gender: gender.rows,
                education: education.rows,
                religion: religion.rows,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: "❌ Failed to retrieve data",
            error: error.message,
        });
    }
});
export default router;
//# sourceMappingURL=debug.js.map
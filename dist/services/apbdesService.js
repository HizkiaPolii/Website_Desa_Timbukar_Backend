import { getPool } from "../config/connectionPool.js";
export class ApbdesService {
    async getAll() {
        try {
            const pool = getPool();
            const result = await pool.query(`SELECT id, tahun, keterangan, pendapatan, belanja, pembiayaan, 
                file_dokumen, created_at, updated_at 
         FROM apbdes 
         ORDER BY tahun DESC, created_at DESC`);
            return result.rows;
        }
        catch (error) {
            console.error("Error in ApbdesService.getAll:", error);
            throw error;
        }
    }
    async getById(id) {
        try {
            const pool = getPool();
            const result = await pool.query(`SELECT id, tahun, keterangan, pendapatan, belanja, pembiayaan, 
                file_dokumen, created_at, updated_at 
         FROM apbdes 
         WHERE id = $1`, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("Error in ApbdesService.getById:", error);
            throw error;
        }
    }
    async getByTahun(tahun) {
        try {
            const pool = getPool();
            const result = await pool.query(`SELECT id, tahun, keterangan, pendapatan, belanja, pembiayaan, 
                file_dokumen, created_at, updated_at 
         FROM apbdes 
         WHERE tahun = $1 
         LIMIT 1`, [tahun]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("Error in ApbdesService.getByTahun:", error);
            throw error;
        }
    }
    async create(input) {
        try {
            const pool = getPool();
            const result = await pool.query(`INSERT INTO apbdes 
         (tahun, keterangan, pendapatan, belanja, pembiayaan, file_dokumen, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         RETURNING id, tahun, keterangan, pendapatan, belanja, pembiayaan, 
                   file_dokumen, created_at, updated_at`, [
                input.tahun,
                input.keterangan,
                input.pendapatan,
                input.belanja,
                input.pembiayaan,
                input.file_dokumen || null,
            ]);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in ApbdesService.create:", error);
            throw error;
        }
    }
    async update(id, input) {
        try {
            const pool = getPool();
            // Build dynamic update query
            const updateFields = [];
            const values = [];
            let paramCounter = 1;
            if (input.tahun !== undefined) {
                updateFields.push(`tahun = $${paramCounter++}`);
                values.push(input.tahun);
            }
            if (input.keterangan !== undefined) {
                updateFields.push(`keterangan = $${paramCounter++}`);
                values.push(input.keterangan);
            }
            if (input.pendapatan !== undefined) {
                updateFields.push(`pendapatan = $${paramCounter++}`);
                values.push(input.pendapatan);
            }
            if (input.belanja !== undefined) {
                updateFields.push(`belanja = $${paramCounter++}`);
                values.push(input.belanja);
            }
            if (input.pembiayaan !== undefined) {
                updateFields.push(`pembiayaan = $${paramCounter++}`);
                values.push(input.pembiayaan);
            }
            if (input.file_dokumen !== undefined) {
                updateFields.push(`file_dokumen = $${paramCounter++}`);
                values.push(input.file_dokumen || null);
            }
            updateFields.push(`updated_at = NOW()`);
            values.push(id);
            const query = `UPDATE apbdes 
                     SET ${updateFields.join(", ")} 
                     WHERE id = $${paramCounter} 
                     RETURNING id, tahun, keterangan, pendapatan, belanja, pembiayaan, 
                               file_dokumen, created_at, updated_at`;
            const result = await pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in ApbdesService.update:", error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const pool = getPool();
            const result = await pool.query("DELETE FROM apbdes WHERE id = $1", [id]);
            return result.rowCount ? result.rowCount > 0 : false;
        }
        catch (error) {
            console.error("Error in ApbdesService.delete:", error);
            throw error;
        }
    }
    async getSummary(tahun) {
        try {
            const pool = getPool();
            const result = await pool.query(`SELECT 
           tahun,
           SUM(pendapatan) as total_pendapatan,
           SUM(belanja) as total_belanja,
           SUM(pembiayaan) as total_pembiayaan,
           (SUM(pendapatan) - SUM(belanja) - SUM(pembiayaan)) as surplus_defisit
         FROM apbdes
         WHERE tahun = $1
         GROUP BY tahun`, [tahun]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("Error in ApbdesService.getSummary:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=apbdesService.js.map
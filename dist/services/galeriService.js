import { getPool } from "../config/connectionPool.js";
export class GaleriService {
    /**
     * Mendapatkan semua galeri dengan pagination, filter, dan search
     */
    async getAllGaleri(limit = 20, offset = 0, kategori, search) {
        const pool = getPool();
        try {
            // Build main query
            let query = "SELECT * FROM galeri WHERE 1=1";
            const params = [];
            let paramIndex = 1;
            if (kategori) {
                query += ` AND kategori = $${paramIndex}`;
                params.push(kategori);
                paramIndex++;
            }
            if (search) {
                query += ` AND (judul ILIKE $${paramIndex} OR deskripsi ILIKE $${paramIndex + 1})`;
                params.push(`%${search}%`, `%${search}%`);
                paramIndex += 2;
            }
            query += " ORDER BY created_at DESC";
            query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit, offset);
            // Get data
            const result = await pool.query(query, params);
            // Get total count
            let countQuery = "SELECT COUNT(*) as total FROM galeri WHERE 1=1";
            const countParams = [];
            let countParamIndex = 1;
            if (kategori) {
                countQuery += ` AND kategori = $${countParamIndex}`;
                countParams.push(kategori);
                countParamIndex++;
            }
            if (search) {
                countQuery += ` AND (judul ILIKE $${countParamIndex} OR deskripsi ILIKE $${countParamIndex + 1})`;
                countParams.push(`%${search}%`, `%${search}%`);
            }
            const countResult = await pool.query(countQuery, countParams);
            const total = parseInt(countResult.rows[0].total);
            return {
                data: result.rows,
                total,
            };
        }
        catch (error) {
            console.error("Error in getAllGaleri:", error);
            throw error;
        }
    }
    /**
     * Mendapatkan galeri berdasarkan ID
     */
    async getGaleriById(id) {
        const pool = getPool();
        try {
            const result = await pool.query("SELECT * FROM galeri WHERE id = $1", [
                id,
            ]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in getGaleriById:", error);
            throw error;
        }
    }
    /**
     * Membuat galeri baru
     */
    async createGaleri(input) {
        const pool = getPool();
        try {
            // Validasi input
            if (!input.judul || !input.judul.trim()) {
                throw new Error("Judul tidak boleh kosong");
            }
            if (!input.gambar || !input.gambar.trim()) {
                throw new Error("Gambar tidak boleh kosong");
            }
            if (!input.kategori || !input.kategori.trim()) {
                throw new Error("Kategori tidak boleh kosong");
            }
            const result = await pool.query(`INSERT INTO galeri (judul, deskripsi, gambar, kategori, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`, [
                input.judul.trim(),
                input.deskripsi || null,
                input.gambar.trim(),
                input.kategori.trim(),
            ]);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in createGaleri:", error);
            throw error;
        }
    }
    /**
     * Update galeri
     */
    async updateGaleri(id, input) {
        const pool = getPool();
        try {
            // Cek apakah galeri ada
            const checkResult = await pool.query("SELECT * FROM galeri WHERE id = $1", [id]);
            if (checkResult.rows.length === 0) {
                throw new Error("Galeri tidak ditemukan");
            }
            // Build dynamic update query
            const updates = [];
            const params = [];
            let paramIndex = 1;
            if (input.judul !== undefined && input.judul !== null) {
                updates.push(`judul = $${paramIndex}`);
                params.push(input.judul.trim());
                paramIndex++;
            }
            if (input.deskripsi !== undefined) {
                updates.push(`deskripsi = $${paramIndex}`);
                params.push(input.deskripsi || null);
                paramIndex++;
            }
            if (input.gambar !== undefined && input.gambar !== null) {
                updates.push(`gambar = $${paramIndex}`);
                params.push(input.gambar.trim());
                paramIndex++;
            }
            if (input.kategori !== undefined && input.kategori !== null) {
                updates.push(`kategori = $${paramIndex}`);
                params.push(input.kategori.trim());
                paramIndex++;
            }
            if (updates.length === 0) {
                throw new Error("Tidak ada field untuk diupdate");
            }
            updates.push(`updated_at = NOW()`);
            params.push(id);
            const query = `UPDATE galeri SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
            const result = await pool.query(query, params);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in updateGaleri:", error);
            throw error;
        }
    }
    /**
     * Hapus galeri
     */
    async deleteGaleri(id) {
        const pool = getPool();
        try {
            // Cek apakah galeri ada
            const checkResult = await pool.query("SELECT * FROM galeri WHERE id = $1", [id]);
            if (checkResult.rows.length === 0) {
                throw new Error("Galeri tidak ditemukan");
            }
            const result = await pool.query("DELETE FROM galeri WHERE id = $1 RETURNING *", [id]);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in deleteGaleri:", error);
            throw error;
        }
    }
    /**
     * Mendapatkan daftar kategori yang tersedia
     */
    async getKategoriList() {
        const pool = getPool();
        try {
            const result = await pool.query("SELECT DISTINCT kategori FROM galeri ORDER BY kategori ASC");
            return result.rows.map((row) => row.kategori);
        }
        catch (error) {
            console.error("Error in getKategoriList:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=galeriService.js.map
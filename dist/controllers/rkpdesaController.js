import { getPool } from "../config/connectionPool.js";
export class RKPDesaController {
    async getAll(req, res) {
        try {
            const pool = getPool();
            const query = `
        SELECT 
          id, 
          tahun, 
          judul, 
          deskripsi, 
          anggaran, 
          status, 
          file_dokumen as "fileDokumen",
          created_at as "createdAt", 
          updated_at as "updatedAt" 
        FROM rkpdesa 
        ORDER BY tahun DESC, created_at DESC
      `;
            const result = await pool.query(query);
            return res.status(200).json({
                message: "Data RKPDESA berhasil didapatkan",
                data: result.rows,
            });
        }
        catch (error) {
            console.error("Error in getAll:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            // Validasi ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            const pool = getPool();
            const query = `
        SELECT 
          id, 
          tahun, 
          judul, 
          deskripsi, 
          anggaran, 
          status, 
          file_dokumen as "fileDokumen",
          created_at as "createdAt", 
          updated_at as "updatedAt" 
        FROM rkpdesa 
        WHERE id = $1
      `;
            const result = await pool.query(query, [Number(id)]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Data RKPDESA tidak ditemukan" });
            }
            return res.status(200).json({
                message: "Data RKPDESA berhasil didapatkan",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in getById:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getByTahun(req, res) {
        try {
            const { tahun } = req.params;
            // Validasi tahun
            if (!tahun || isNaN(Number(tahun))) {
                return res.status(400).json({ error: "Tahun tidak valid" });
            }
            const pool = getPool();
            const query = `
        SELECT 
          id, 
          tahun, 
          judul, 
          deskripsi, 
          anggaran, 
          status, 
          file_dokumen as "fileDokumen",
          created_at as "createdAt", 
          updated_at as "updatedAt" 
        FROM rkpdesa 
        WHERE tahun = $1
        ORDER BY created_at DESC
      `;
            const result = await pool.query(query, [Number(tahun)]);
            return res.status(200).json({
                message: "Data RKPDESA berhasil didapatkan",
                data: result.rows,
            });
        }
        catch (error) {
            console.error("Error in getByTahun:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async create(req, res) {
        try {
            const { tahun, judul, deskripsi, anggaran, status, fileDokumen } = req.body;
            // Validasi input
            const errors = {};
            if (!tahun || isNaN(Number(tahun))) {
                errors.tahun = "Tahun harus diisi dengan angka yang valid";
            }
            else if (tahun < 1900 || tahun > 2100) {
                errors.tahun = "Tahun harus antara 1900 dan 2100";
            }
            if (!judul || typeof judul !== "string" || judul.trim().length === 0) {
                errors.judul = "Judul harus diisi";
            }
            else if (judul.length > 200) {
                errors.judul = "Judul maksimal 200 karakter";
            }
            if (deskripsi && typeof deskripsi !== "string") {
                errors.deskripsi = "Deskripsi harus berupa teks";
            }
            if (!anggaran || isNaN(Number(anggaran))) {
                errors.anggaran = "Anggaran harus diisi dengan angka yang valid";
            }
            else if (Number(anggaran) < 0) {
                errors.anggaran = "Anggaran tidak boleh negatif";
            }
            if (!status || typeof status !== "string") {
                errors.status = "Status harus diisi";
            }
            const validStatuses = ["draft", "aktif", "selesai", "tertunda"];
            if (status && !validStatuses.includes(status.toLowerCase())) {
                errors.status = `Status harus salah satu dari: ${validStatuses.join(", ")}`;
            }
            if (fileDokumen && typeof fileDokumen !== "string") {
                errors.fileDokumen = "File dokumen harus berupa URL string";
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    details: errors,
                });
            }
            const pool = getPool();
            const query = `
        INSERT INTO rkpdesa (tahun, judul, deskripsi, anggaran, status, file_dokumen, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING 
          id, 
          tahun, 
          judul, 
          deskripsi, 
          anggaran, 
          status, 
          file_dokumen as "fileDokumen",
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `;
            const result = await pool.query(query, [
                Number(tahun),
                judul.trim(),
                deskripsi || null,
                Number(anggaran),
                status.toLowerCase(),
                fileDokumen || null,
            ]);
            return res.status(201).json({
                message: "Data RKPDESA berhasil ditambahkan",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in create:", error);
            return res.status(500).json({
                error: "Gagal menambahkan data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { tahun, judul, deskripsi, anggaran, status, fileDokumen } = req.body;
            // Validasi ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            // Validasi input
            const errors = {};
            if (tahun !== undefined) {
                if (isNaN(Number(tahun))) {
                    errors.tahun = "Tahun harus berupa angka yang valid";
                }
                else if (tahun < 1900 || tahun > 2100) {
                    errors.tahun = "Tahun harus antara 1900 dan 2100";
                }
            }
            if (judul !== undefined) {
                if (typeof judul !== "string" || judul.trim().length === 0) {
                    errors.judul = "Judul harus berupa teks yang tidak kosong";
                }
                else if (judul.length > 200) {
                    errors.judul = "Judul maksimal 200 karakter";
                }
            }
            if (deskripsi !== undefined && typeof deskripsi !== "string") {
                errors.deskripsi = "Deskripsi harus berupa teks";
            }
            if (anggaran !== undefined) {
                if (isNaN(Number(anggaran))) {
                    errors.anggaran = "Anggaran harus berupa angka yang valid";
                }
                else if (Number(anggaran) < 0) {
                    errors.anggaran = "Anggaran tidak boleh negatif";
                }
            }
            if (status !== undefined) {
                const validStatuses = ["draft", "aktif", "selesai", "tertunda"];
                if (!validStatuses.includes(status.toLowerCase())) {
                    errors.status = `Status harus salah satu dari: ${validStatuses.join(", ")}`;
                }
            }
            if (fileDokumen !== undefined && typeof fileDokumen !== "string") {
                errors.fileDokumen = "File dokumen harus berupa URL string";
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    details: errors,
                });
            }
            // Check if data exists
            const pool = getPool();
            const checkQuery = "SELECT id FROM rkpdesa WHERE id = $1";
            const checkResult = await pool.query(checkQuery, [Number(id)]);
            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: "Data RKPDESA tidak ditemukan" });
            }
            // Build dynamic update query
            const updates = [];
            const values = [];
            let paramCount = 1;
            if (tahun !== undefined) {
                updates.push(`tahun = $${paramCount}`);
                values.push(Number(tahun));
                paramCount++;
            }
            if (judul !== undefined) {
                updates.push(`judul = $${paramCount}`);
                values.push(judul.trim());
                paramCount++;
            }
            if (deskripsi !== undefined) {
                updates.push(`deskripsi = $${paramCount}`);
                values.push(deskripsi || null);
                paramCount++;
            }
            if (anggaran !== undefined) {
                updates.push(`anggaran = $${paramCount}`);
                values.push(Number(anggaran));
                paramCount++;
            }
            if (status !== undefined) {
                updates.push(`status = $${paramCount}`);
                values.push(status.toLowerCase());
                paramCount++;
            }
            if (fileDokumen !== undefined) {
                updates.push(`file_dokumen = $${paramCount}`);
                values.push(fileDokumen || null);
                paramCount++;
            }
            // Always update updated_at
            updates.push(`updated_at = NOW()`);
            if (updates.length === 1) {
                // Only updated_at would be updated
                return res.status(400).json({
                    error: "Tidak ada data yang diupdate",
                });
            }
            const updateQuery = `
        UPDATE rkpdesa 
        SET ${updates.join(", ")}
        WHERE id = $${paramCount}
        RETURNING 
          id, 
          tahun, 
          judul, 
          deskripsi, 
          anggaran, 
          status, 
          file_dokumen as "fileDokumen",
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `;
            values.push(Number(id));
            const result = await pool.query(updateQuery, values);
            return res.status(200).json({
                message: "Data RKPDESA berhasil diperbarui",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in update:", error);
            return res.status(500).json({
                error: "Gagal memperbarui data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            // Validasi ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            const pool = getPool();
            // Check if data exists
            const checkQuery = "SELECT id FROM rkpdesa WHERE id = $1";
            const checkResult = await pool.query(checkQuery, [Number(id)]);
            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: "Data RKPDESA tidak ditemukan" });
            }
            // Delete the data
            const deleteQuery = "DELETE FROM rkpdesa WHERE id = $1";
            await pool.query(deleteQuery, [Number(id)]);
            return res.status(200).json({
                message: "Data RKPDESA berhasil dihapus",
            });
        }
        catch (error) {
            console.error("Error in delete:", error);
            return res.status(500).json({
                error: "Gagal menghapus data RKPDESA",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
//# sourceMappingURL=rkpdesaController.js.map
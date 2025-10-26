import { getPool } from "../config/connectionPool.js";
export class PemerintahanDesaController {
    async getAll(req, res) {
        try {
            const pool = getPool();
            const query = `
        SELECT 
          id, 
          nama, 
          jabatan, 
          nip, 
          no_telepon as "noTelepon", 
          alamat, 
          foto,
          kategori,
          created_at as "createdAt", 
          updated_at as "updatedAt" 
        FROM pemerintahan 
        ORDER BY jabatan, nama
      `;
            const result = await pool.query(query);
            return res.status(200).json({
                message: "Data pemerintahan desa berhasil didapatkan",
                data: result.rows,
            });
        }
        catch (error) {
            console.error("Error in getAll:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data pemerintahan",
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
          nama, 
          jabatan, 
          nip, 
          no_telepon as "noTelepon", 
          alamat, 
          foto,
          kategori,
          created_at as "createdAt", 
          updated_at as "updatedAt" 
        FROM pemerintahan 
        WHERE id = $1
      `;
            const result = await pool.query(query, [Number(id)]);
            if (result.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data pemerintahan tidak ditemukan" });
            }
            return res.status(200).json({
                message: "Data pemerintahan desa berhasil didapatkan",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in getById:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data pemerintahan",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async create(req, res) {
        try {
            const { nama, jabatan, nip, noTelepon, alamat, foto, kategori } = req.body;
            // Validasi input
            const errors = {};
            if (!nama || typeof nama !== "string" || nama.trim().length === 0) {
                errors.nama = "Nama harus diisi";
            }
            else if (nama.length > 100) {
                errors.nama = "Nama maksimal 100 karakter";
            }
            if (!jabatan ||
                typeof jabatan !== "string" ||
                jabatan.trim().length === 0) {
                errors.jabatan = "Jabatan harus diisi";
            }
            else if (jabatan.length > 100) {
                errors.jabatan = "Jabatan maksimal 100 karakter";
            }
            if (!nip || typeof nip !== "string" || nip.trim().length === 0) {
                errors.nip = "NIP harus diisi";
            }
            else if (!/^\d{15,20}$/.test(nip.trim())) {
                errors.nip = "NIP harus berisi 15-20 digit angka";
            }
            if (!noTelepon ||
                typeof noTelepon !== "string" ||
                noTelepon.trim().length === 0) {
                errors.noTelepon = "Nomor telepon harus diisi";
            }
            else if (!/^\d{10,15}$/.test(noTelepon.replace(/\D/g, ""))) {
                errors.noTelepon = "Nomor telepon tidak valid (10-15 digit)";
            }
            if (!alamat || typeof alamat !== "string" || alamat.trim().length === 0) {
                errors.alamat = "Alamat harus diisi";
            }
            else if (alamat.length > 500) {
                errors.alamat = "Alamat maksimal 500 karakter";
            }
            if (kategori !== undefined) {
                if (!["pemimpin_desa", "perangkat_desa", "perangkat_penunjang"].includes(kategori)) {
                    errors.kategori = "Kategori tidak valid";
                }
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({
                    error: "Validasi input gagal",
                    details: errors,
                });
            }
            const pool = getPool();
            // Check NIP unique
            const nipCheck = await pool.query("SELECT id FROM pemerintahan WHERE nip = $1", [nip.trim()]);
            if (nipCheck.rows.length > 0) {
                return res.status(409).json({ error: "NIP sudah terdaftar" });
            }
            const query = `
        INSERT INTO pemerintahan (nama, jabatan, nip, no_telepon, alamat, foto, kategori)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
          id, 
          nama, 
          jabatan, 
          nip, 
          no_telepon as "noTelepon", 
          alamat, 
          foto,
          kategori,
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `;
            const result = await pool.query(query, [
                nama.trim(),
                jabatan.trim(),
                nip.trim(),
                noTelepon.trim(),
                alamat.trim(),
                foto || null,
                kategori || "perangkat_desa",
            ]);
            return res.status(201).json({
                message: "Data pemerintahan berhasil dibuat",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in create:", error);
            return res.status(500).json({
                error: "Gagal membuat data pemerintahan",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nama, jabatan, nip, noTelepon, alamat, foto, kategori } = req.body;
            // Validasi ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            const pool = getPool();
            // Check if record exists
            const existCheck = await pool.query("SELECT id FROM pemerintahan WHERE id = $1", [Number(id)]);
            if (existCheck.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data pemerintahan tidak ditemukan" });
            }
            // Validasi input
            const errors = {};
            if (nama !== undefined &&
                (typeof nama !== "string" || nama.trim().length === 0)) {
                errors.nama = "Nama harus diisi";
            }
            else if (nama && nama.length > 100) {
                errors.nama = "Nama maksimal 100 karakter";
            }
            if (jabatan !== undefined &&
                (typeof jabatan !== "string" || jabatan.trim().length === 0)) {
                errors.jabatan = "Jabatan harus diisi";
            }
            else if (jabatan && jabatan.length > 100) {
                errors.jabatan = "Jabatan maksimal 100 karakter";
            }
            if (nip !== undefined &&
                (typeof nip !== "string" || nip.trim().length === 0)) {
                errors.nip = "NIP harus diisi";
            }
            else if (nip && !/^\d{15,20}$/.test(nip.trim())) {
                errors.nip = "NIP harus berisi 15-20 digit angka";
            }
            if (noTelepon !== undefined &&
                (typeof noTelepon !== "string" || noTelepon.trim().length === 0)) {
                errors.noTelepon = "Nomor telepon harus diisi";
            }
            else if (noTelepon &&
                !/^\d{10,15}$/.test(noTelepon.replace(/\D/g, ""))) {
                errors.noTelepon = "Nomor telepon tidak valid (10-15 digit)";
            }
            if (alamat !== undefined &&
                (typeof alamat !== "string" || alamat.trim().length === 0)) {
                errors.alamat = "Alamat harus diisi";
            }
            else if (alamat && alamat.length > 500) {
                errors.alamat = "Alamat maksimal 500 karakter";
            }
            if (kategori !== undefined) {
                if (!["pemimpin_desa", "perangkat_desa", "perangkat_penunjang"].includes(kategori)) {
                    errors.kategori = "Kategori tidak valid";
                }
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({
                    error: "Validasi input gagal",
                    details: errors,
                });
            }
            // Check NIP unique if being updated
            if (nip) {
                const nipCheck = await pool.query("SELECT id FROM pemerintahan WHERE nip = $1 AND id != $2", [nip.trim(), Number(id)]);
                if (nipCheck.rows.length > 0) {
                    return res.status(409).json({ error: "NIP sudah terdaftar" });
                }
            }
            // Build dynamic update query
            const updateFields = [];
            const updateValues = [];
            let paramCount = 1;
            if (nama !== undefined) {
                updateFields.push(`nama = $${paramCount++}`);
                updateValues.push(nama.trim());
            }
            if (jabatan !== undefined) {
                updateFields.push(`jabatan = $${paramCount++}`);
                updateValues.push(jabatan.trim());
            }
            if (nip !== undefined) {
                updateFields.push(`nip = $${paramCount++}`);
                updateValues.push(nip.trim());
            }
            if (noTelepon !== undefined) {
                updateFields.push(`no_telepon = $${paramCount++}`);
                updateValues.push(noTelepon.trim());
            }
            if (alamat !== undefined) {
                updateFields.push(`alamat = $${paramCount++}`);
                updateValues.push(alamat.trim());
            }
            if (foto !== undefined) {
                updateFields.push(`foto = $${paramCount++}`);
                updateValues.push(foto || null);
            }
            if (kategori !== undefined) {
                updateFields.push(`kategori = $${paramCount++}`);
                updateValues.push(kategori);
            }
            if (updateFields.length === 0) {
                return res.status(400).json({ error: "Tidak ada data yang diupdate" });
            }
            updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
            updateValues.push(Number(id));
            const query = `
        UPDATE pemerintahan
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING 
          id, 
          nama, 
          jabatan, 
          nip, 
          no_telepon as "noTelepon", 
          alamat, 
          foto,
          kategori,
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `;
            const result = await pool.query(query, updateValues);
            return res.status(200).json({
                message: "Data pemerintahan berhasil diperbarui",
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error in update:", error);
            return res.status(500).json({
                error: "Gagal memperbarui data pemerintahan",
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
            // Check if record exists
            const existCheck = await pool.query("SELECT id FROM pemerintahan WHERE id = $1", [Number(id)]);
            if (existCheck.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data pemerintahan tidak ditemukan" });
            }
            const query = `DELETE FROM pemerintahan WHERE id = $1`;
            await pool.query(query, [Number(id)]);
            return res.status(200).json({
                message: "Data pemerintahan berhasil dihapus",
                data: {
                    id: Number(id),
                },
            });
        }
        catch (error) {
            console.error("Error in delete:", error);
            return res.status(500).json({
                error: "Gagal menghapus data pemerintahan",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
//# sourceMappingURL=pemerintahanController.js.map
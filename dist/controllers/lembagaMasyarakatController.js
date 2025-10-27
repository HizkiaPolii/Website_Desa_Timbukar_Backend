import { getPool } from "../config/connectionPool.js";
const formatLembagaMasyarakat = (lembaga) => ({
    id: lembaga.id,
    nama: lembaga.nama_lembaga,
    deskripsi: lembaga.deskripsi,
    ketua: lembaga.ketua,
    noTelepon: lembaga.no_telepon,
    alamat: lembaga.alamat,
    gambar: lembaga.gambar,
    createdAt: lembaga.created_at,
    updatedAt: lembaga.updated_at,
});
export class LembagaMasyarakatController {
    async getAll(req, res) {
        try {
            const pool = getPool();
            const query = "SELECT * FROM lembaga_masyarakat ORDER BY id ASC";
            const result = await pool.query(query);
            const lembagaMasyarakat = result.rows.map(formatLembagaMasyarakat);
            return res.status(200).json({
                message: "Data lembaga masyarakat berhasil didapatkan",
                data: lembagaMasyarakat,
            });
        }
        catch (error) {
            console.error("Error fetching lembaga masyarakat:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data lembaga masyarakat",
                details: error instanceof Error ? error.message : "",
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const pool = getPool();
            const query = "SELECT * FROM lembaga_masyarakat WHERE id = $1";
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data lembaga masyarakat tidak ditemukan" });
            }
            const lembagaMasyarakat = formatLembagaMasyarakat(result.rows[0]);
            return res.status(200).json({
                message: "Data lembaga masyarakat berhasil didapatkan",
                data: lembagaMasyarakat,
            });
        }
        catch (error) {
            console.error("Error fetching lembaga masyarakat by id:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan data lembaga masyarakat",
                details: error instanceof Error ? error.message : "",
            });
        }
    }
    async create(req, res) {
        try {
            let { nama, nama_lembaga, nameLembaga, deskripsi, description, ketua, noTelepon, no_telepon, nomorTelepon, phone, alamat, address, gambar, image, urlGambar, } = req.body;
            const normalizedNama = nama || nama_lembaga || nameLembaga;
            const normalizedDeskripsi = deskripsi || description;
            const normalizedKetua = ketua;
            const normalizedNoTelepon = noTelepon || no_telepon || nomorTelepon || phone;
            const normalizedAlamat = alamat || address;
            const normalizedGambar = gambar || image || urlGambar;
            if (!normalizedNama ||
                (typeof normalizedNama === "string" && normalizedNama.trim() === "")) {
                return res
                    .status(400)
                    .json({ error: "Nama lembaga tidak boleh kosong" });
            }
            const pool = getPool();
            const query = `
        INSERT INTO lembaga_masyarakat (
          nama_lembaga, deskripsi, ketua, no_telepon, alamat, gambar
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
            const values = [
                normalizedNama,
                normalizedDeskripsi || null,
                normalizedKetua || null,
                normalizedNoTelepon || null,
                normalizedAlamat || null,
                normalizedGambar || null,
            ];
            const result = await pool.query(query, values);
            const lembagaMasyarakat = formatLembagaMasyarakat(result.rows[0]);
            return res.status(201).json({
                message: "Data lembaga masyarakat berhasil dibuat",
                data: lembagaMasyarakat,
            });
        }
        catch (error) {
            console.error("Error creating lembaga masyarakat:", error);
            return res.status(500).json({
                error: "Gagal membuat data lembaga masyarakat",
                details: error instanceof Error ? error.message : "",
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            let { nama, nama_lembaga, nameLembaga, deskripsi, description, ketua, noTelepon, no_telepon, nomorTelepon, phone, alamat, address, gambar, image, urlGambar, } = req.body;
            const normalizedNama = nama || nama_lembaga || nameLembaga;
            const normalizedDeskripsi = deskripsi || description;
            const normalizedKetua = ketua;
            const normalizedNoTelepon = noTelepon || no_telepon || nomorTelepon || phone;
            const normalizedAlamat = alamat || address;
            const normalizedGambar = gambar || image || urlGambar;
            if (!normalizedNama ||
                (typeof normalizedNama === "string" && normalizedNama.trim() === "")) {
                return res
                    .status(400)
                    .json({ error: "Nama lembaga tidak boleh kosong" });
            }
            const pool = getPool();
            const checkQuery = "SELECT id FROM lembaga_masyarakat WHERE id = $1";
            const checkResult = await pool.query(checkQuery, [id]);
            if (checkResult.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data lembaga masyarakat tidak ditemukan" });
            }
            const query = `
        UPDATE lembaga_masyarakat SET
          nama_lembaga = $1,
          deskripsi = $2,
          ketua = $3,
          no_telepon = $4,
          alamat = $5,
          gambar = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;
            const values = [
                normalizedNama,
                normalizedDeskripsi || null,
                normalizedKetua || null,
                normalizedNoTelepon || null,
                normalizedAlamat || null,
                normalizedGambar || null,
                id,
            ];
            const result = await pool.query(query, values);
            const lembagaMasyarakat = formatLembagaMasyarakat(result.rows[0]);
            return res.status(200).json({
                message: "Data lembaga masyarakat berhasil diperbarui",
                data: lembagaMasyarakat,
            });
        }
        catch (error) {
            console.error("Error updating lembaga masyarakat:", error);
            return res.status(500).json({
                error: "Gagal memperbarui data lembaga masyarakat",
                details: error instanceof Error ? error.message : "",
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const pool = getPool();
            const checkQuery = "SELECT id FROM lembaga_masyarakat WHERE id = $1";
            const checkResult = await pool.query(checkQuery, [id]);
            if (checkResult.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Data lembaga masyarakat tidak ditemukan" });
            }
            const query = "DELETE FROM lembaga_masyarakat WHERE id = $1";
            await pool.query(query, [id]);
            return res.status(200).json({
                message: "Data lembaga masyarakat berhasil dihapus",
                data: {
                    id: parseInt(id),
                },
            });
        }
        catch (error) {
            console.error("Error deleting lembaga masyarakat:", error);
            return res.status(500).json({
                error: "Gagal menghapus data lembaga masyarakat",
                details: error instanceof Error ? error.message : "",
            });
        }
    }
}
//# sourceMappingURL=lembagaMasyarakatController.js.map
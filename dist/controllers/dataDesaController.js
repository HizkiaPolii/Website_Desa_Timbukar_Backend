import { getPool } from "../config/connectionPool.js";
export class DataDesaController {
    async getAll(req, res) {
        try {
            const pool = getPool();
            // Query semua data dari database secara parallel
            const [statistics, demographics, gender, education, religion] = await Promise.all([
                pool.query("SELECT * FROM desa_statistics LIMIT 1"),
                pool.query("SELECT * FROM desa_demographics ORDER BY id"),
                pool.query("SELECT * FROM desa_gender ORDER BY id"),
                pool.query("SELECT * FROM desa_education ORDER BY id"),
                pool.query("SELECT * FROM desa_religion ORDER BY id"),
            ]);
            // Format data sesuai struktur frontend
            const dataDesa = {
                statistics: {
                    populasi: statistics.rows[0]?.populasi || "0",
                    kepalakeluarga: statistics.rows[0]?.kepala_keluarga || "0",
                    luasWilayah: statistics.rows[0]?.luas_wilayah || "0",
                    angkaPertumbuhan: statistics.rows[0]?.angka_pertumbuhan || "0%",
                    jumlahBayi: statistics.rows[0]?.jumlah_bayi || "0",
                    angkaHarapanHidup: statistics.rows[0]?.angka_harapan_hidup || "0",
                },
                demographics: demographics.rows.map((row) => ({
                    kategori: row.kategori_usia,
                    persentase: row.persentase,
                    jumlah: row.jumlah.toString(),
                })),
                gender: gender.rows.map((row) => ({
                    jenis: row.jenis_kelamin,
                    jumlah: row.jumlah.toString(),
                    persentase: row.persentase,
                })),
                education: education.rows.map((row) => ({
                    tingkat: row.tingkat_pendidikan,
                    jumlah: row.jumlah.toString(),
                    persentase: row.persentase,
                })),
                religion: religion.rows.map((row) => ({
                    agama: row.agama,
                    jumlah: row.jumlah.toString(),
                    persentase: row.persentase,
                })),
            };
            return res.status(200).json({
                message: "Data desa berhasil didapatkan",
                data: dataDesa,
            });
        }
        catch (error) {
            console.error("Error fetching data desa:", error);
            return res.status(500).json({ error: "Gagal mendapatkan data desa" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const pool = getPool();
            // Query berdasarkan kategori (demographics, gender, education, religion)
            let result;
            switch (id) {
                case "demographics":
                    result = await pool.query("SELECT * FROM desa_demographics");
                    return res.status(200).json({
                        message: "Data demografi berhasil didapatkan",
                        data: result.rows.map((row) => ({
                            id: row.id,
                            kategori: row.kategori_usia,
                            jumlah: row.jumlah,
                            persentase: row.persentase,
                        })),
                    });
                case "gender":
                    result = await pool.query("SELECT * FROM desa_gender");
                    return res.status(200).json({
                        message: "Data jenis kelamin berhasil didapatkan",
                        data: result.rows.map((row) => ({
                            id: row.id,
                            jenis: row.jenis_kelamin,
                            jumlah: row.jumlah,
                            persentase: row.persentase,
                        })),
                    });
                case "education":
                    result = await pool.query("SELECT * FROM desa_education");
                    return res.status(200).json({
                        message: "Data pendidikan berhasil didapatkan",
                        data: result.rows.map((row) => ({
                            id: row.id,
                            tingkat: row.tingkat_pendidikan,
                            jumlah: row.jumlah,
                            persentase: row.persentase,
                        })),
                    });
                case "religion":
                    result = await pool.query("SELECT * FROM desa_religion");
                    return res.status(200).json({
                        message: "Data agama berhasil didapatkan",
                        data: result.rows.map((row) => ({
                            id: row.id,
                            agama: row.agama,
                            jumlah: row.jumlah,
                            persentase: row.persentase,
                        })),
                    });
                case "statistics":
                    result = await pool.query("SELECT * FROM desa_statistics LIMIT 1");
                    return res.status(200).json({
                        message: "Data statistik berhasil didapatkan",
                        data: result.rows[0] || {},
                    });
                default:
                    return res.status(400).json({ error: "Kategori tidak diketahui" });
            }
        }
        catch (error) {
            console.error("Error fetching data by id:", error);
            return res.status(500).json({ error: "Gagal mendapatkan data desa" });
        }
    }
    async create(req, res) {
        try {
            const { kategori, ...dataFields } = req.body;
            const pool = getPool();
            // Validasi input
            if (!kategori || !dataFields) {
                return res.status(400).json({ error: "Data tidak lengkap" });
            }
            let result;
            let message = "";
            // Simpan ke database berdasarkan kategori
            switch (kategori) {
                case "demographics":
                    if (!dataFields.kategori_usia ||
                        !dataFields.jumlah ||
                        !dataFields.persentase) {
                        return res
                            .status(400)
                            .json({ error: "Field demographics tidak lengkap" });
                    }
                    result = await pool.query("INSERT INTO desa_demographics (kategori_usia, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *", [dataFields.kategori_usia, dataFields.jumlah, dataFields.persentase]);
                    message = "Data demografi berhasil dibuat";
                    break;
                case "gender":
                    if (!dataFields.jenis_kelamin ||
                        !dataFields.jumlah ||
                        !dataFields.persentase) {
                        return res
                            .status(400)
                            .json({ error: "Field gender tidak lengkap" });
                    }
                    result = await pool.query("INSERT INTO desa_gender (jenis_kelamin, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *", [dataFields.jenis_kelamin, dataFields.jumlah, dataFields.persentase]);
                    message = "Data jenis kelamin berhasil dibuat";
                    break;
                case "education":
                    if (!dataFields.tingkat_pendidikan ||
                        !dataFields.jumlah ||
                        !dataFields.persentase) {
                        return res
                            .status(400)
                            .json({ error: "Field education tidak lengkap" });
                    }
                    result = await pool.query("INSERT INTO desa_education (tingkat_pendidikan, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *", [
                        dataFields.tingkat_pendidikan,
                        dataFields.jumlah,
                        dataFields.persentase,
                    ]);
                    message = "Data pendidikan berhasil dibuat";
                    break;
                case "religion":
                    if (!dataFields.agama ||
                        !dataFields.jumlah ||
                        !dataFields.persentase) {
                        return res
                            .status(400)
                            .json({ error: "Field religion tidak lengkap" });
                    }
                    result = await pool.query("INSERT INTO desa_religion (agama, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *", [dataFields.agama, dataFields.jumlah, dataFields.persentase]);
                    message = "Data agama berhasil dibuat";
                    break;
                case "statistics":
                    if (!dataFields.populasi ||
                        !dataFields.kepala_keluarga ||
                        !dataFields.luas_wilayah ||
                        !dataFields.angka_pertumbuhan ||
                        !dataFields.jumlah_bayi ||
                        !dataFields.angka_harapan_hidup) {
                        return res
                            .status(400)
                            .json({ error: "Field statistics tidak lengkap" });
                    }
                    result = await pool.query("INSERT INTO desa_statistics (populasi, kepala_keluarga, luas_wilayah, angka_pertumbuhan, jumlah_bayi, angka_harapan_hidup) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
                        dataFields.populasi,
                        dataFields.kepala_keluarga,
                        dataFields.luas_wilayah,
                        dataFields.angka_pertumbuhan,
                        dataFields.jumlah_bayi,
                        dataFields.angka_harapan_hidup,
                    ]);
                    message = "Data statistik berhasil dibuat";
                    break;
                default:
                    return res.status(400).json({ error: "Kategori tidak diketahui" });
            }
            return res.status(201).json({
                message,
                data: result?.rows[0],
            });
        }
        catch (error) {
            console.error("Error creating data desa:", error);
            return res.status(500).json({ error: "Gagal membuat data desa" });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { kategori, ...dataFields } = req.body;
            const pool = getPool();
            if (!kategori) {
                return res.status(400).json({ error: "Kategori harus ditentukan" });
            }
            let result;
            let message = "";
            // Update database berdasarkan kategori
            switch (kategori) {
                case "demographics":
                    result = await pool.query("UPDATE desa_demographics SET kategori_usia = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *", [
                        dataFields.kategori_usia,
                        dataFields.jumlah,
                        dataFields.persentase,
                        id,
                    ]);
                    message = "Data demografi berhasil diperbarui";
                    break;
                case "gender":
                    result = await pool.query("UPDATE desa_gender SET jenis_kelamin = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *", [
                        dataFields.jenis_kelamin,
                        dataFields.jumlah,
                        dataFields.persentase,
                        id,
                    ]);
                    message = "Data jenis kelamin berhasil diperbarui";
                    break;
                case "education":
                    result = await pool.query("UPDATE desa_education SET tingkat_pendidikan = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *", [
                        dataFields.tingkat_pendidikan,
                        dataFields.jumlah,
                        dataFields.persentase,
                        id,
                    ]);
                    message = "Data pendidikan berhasil diperbarui";
                    break;
                case "religion":
                    result = await pool.query("UPDATE desa_religion SET agama = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *", [dataFields.agama, dataFields.jumlah, dataFields.persentase, id]);
                    message = "Data agama berhasil diperbarui";
                    break;
                case "statistics":
                    result = await pool.query("UPDATE desa_statistics SET populasi = $1, kepala_keluarga = $2, luas_wilayah = $3, angka_pertumbuhan = $4, jumlah_bayi = $5, angka_harapan_hidup = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *", [
                        dataFields.populasi,
                        dataFields.kepala_keluarga,
                        dataFields.luas_wilayah,
                        dataFields.angka_pertumbuhan,
                        dataFields.jumlah_bayi,
                        dataFields.angka_harapan_hidup,
                        id,
                    ]);
                    message = "Data statistik berhasil diperbarui";
                    break;
                default:
                    return res.status(400).json({ error: "Kategori tidak diketahui" });
            }
            if (!result?.rows.length) {
                return res.status(404).json({ error: "Data tidak ditemukan" });
            }
            return res.status(200).json({
                message,
                data: result.rows[0],
            });
        }
        catch (error) {
            console.error("Error updating data desa:", error);
            return res.status(500).json({ error: "Gagal memperbarui data desa" });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { kategori } = req.body;
            const pool = getPool();
            if (!kategori) {
                return res.status(400).json({ error: "Kategori harus ditentukan" });
            }
            let result;
            let message = "";
            // Hapus dari database berdasarkan kategori
            switch (kategori) {
                case "demographics":
                    result = await pool.query("DELETE FROM desa_demographics WHERE id = $1 RETURNING *", [id]);
                    message = "Data demografi berhasil dihapus";
                    break;
                case "gender":
                    result = await pool.query("DELETE FROM desa_gender WHERE id = $1 RETURNING *", [id]);
                    message = "Data jenis kelamin berhasil dihapus";
                    break;
                case "education":
                    result = await pool.query("DELETE FROM desa_education WHERE id = $1 RETURNING *", [id]);
                    message = "Data pendidikan berhasil dihapus";
                    break;
                case "religion":
                    result = await pool.query("DELETE FROM desa_religion WHERE id = $1 RETURNING *", [id]);
                    message = "Data agama berhasil dihapus";
                    break;
                case "statistics":
                    result = await pool.query("DELETE FROM desa_statistics WHERE id = $1 RETURNING *", [id]);
                    message = "Data statistik berhasil dihapus";
                    break;
                default:
                    return res.status(400).json({ error: "Kategori tidak diketahui" });
            }
            if (!result?.rows.length) {
                return res.status(404).json({ error: "Data tidak ditemukan" });
            }
            return res.status(200).json({
                message,
                data: {
                    id,
                },
            });
        }
        catch (error) {
            console.error("Error deleting data desa:", error);
            return res.status(500).json({ error: "Gagal menghapus data desa" });
        }
    }
}
//# sourceMappingURL=dataDesaController.js.map
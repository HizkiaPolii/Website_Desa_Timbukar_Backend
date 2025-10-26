import { getPool } from "../config/connectionPool.js";
export class ProfilDesaController {
    async getProfil(req, res) {
        try {
            const pool = getPool();
            // Query database untuk mendapatkan profil desa terbaru
            const result = await pool.query("SELECT id, visi, misi, sejarah, updated_at FROM profil_desa ORDER BY id DESC LIMIT 1");
            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Data profil desa tidak ditemukan",
                });
            }
            const profil = result.rows[0];
            // Parse misi dari JSON string ke array untuk frontend
            let misiArray = [];
            if (profil.misi) {
                try {
                    misiArray = JSON.parse(profil.misi);
                }
                catch (e) {
                    console.error("Error parsing misi JSON:", e);
                    misiArray = [];
                }
            }
            const profilFormatted = {
                id: profil.id,
                visi: profil.visi || "",
                misi: misiArray,
                sejarah: profil.sejarah || "",
                updated_at: profil.updated_at,
            };
            return res.status(200).json({
                message: "Data profil desa berhasil didapatkan",
                data: profilFormatted,
            });
        }
        catch (error) {
            console.error("Error in getProfil:", error);
            return res.status(500).json({
                error: "Gagal mendapatkan profil desa",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async updateProfil(req, res) {
        try {
            const { visi, misi, sejarah } = req.body;
            // Validasi input
            if (!visi || !misi || !sejarah) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "visi, misi, dan sejarah harus diisi",
                });
            }
            // Validasi misi adalah array
            if (!Array.isArray(misi)) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "misi harus berupa array",
                });
            }
            // Validasi bahwa misi tidak kosong
            if (misi.length === 0) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "minimal harus ada 1 misi",
                });
            }
            const pool = getPool();
            // Convert misi array to JSON string untuk database
            const misiString = JSON.stringify(misi);
            // Check if profil exists
            const checkResult = await pool.query("SELECT id FROM profil_desa ORDER BY id DESC LIMIT 1");
            let result;
            if (checkResult.rows.length === 0) {
                // Insert jika belum ada
                result = await pool.query("INSERT INTO profil_desa (visi, misi, sejarah, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id, visi, misi, sejarah, updated_at", [visi, misiString, sejarah]);
            }
            else {
                // Update jika sudah ada
                const profilId = checkResult.rows[0].id;
                result = await pool.query("UPDATE profil_desa SET visi = $1, misi = $2, sejarah = $3, updated_at = NOW() WHERE id = $4 RETURNING id, visi, misi, sejarah, updated_at", [visi, misiString, sejarah, profilId]);
            }
            const updatedProfil = result.rows[0];
            // Parse misi dari JSON string ke array untuk response
            let misiArray = [];
            try {
                misiArray = JSON.parse(updatedProfil.misi);
            }
            catch (e) {
                console.error("Error parsing misi JSON:", e);
                misiArray = misi;
            }
            return res.status(200).json({
                message: "Profil desa berhasil diperbarui",
                data: {
                    id: updatedProfil.id,
                    visi: updatedProfil.visi,
                    misi: misiArray,
                    sejarah: updatedProfil.sejarah,
                    updated_at: updatedProfil.updated_at,
                },
            });
        }
        catch (error) {
            console.error("Error in updateProfil:", error);
            return res.status(500).json({
                error: "Gagal memperbarui profil desa",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async createProfil(req, res) {
        try {
            const { visi, misi, sejarah } = req.body;
            // Validasi input
            if (!visi || !misi || !sejarah) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "visi, misi, dan sejarah harus diisi",
                });
            }
            // Validasi misi adalah array
            if (!Array.isArray(misi)) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "misi harus berupa array",
                });
            }
            // Validasi bahwa misi tidak kosong
            if (misi.length === 0) {
                return res.status(400).json({
                    error: "Validasi gagal",
                    message: "minimal harus ada 1 misi",
                });
            }
            const pool = getPool();
            // Convert misi array to JSON string untuk database
            const misiString = JSON.stringify(misi);
            // Insert data ke database
            const result = await pool.query("INSERT INTO profil_desa (visi, misi, sejarah, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id, visi, misi, sejarah, updated_at", [visi, misiString, sejarah]);
            const createdProfil = result.rows[0];
            // Parse misi dari JSON string ke array untuk response
            let misiArray = [];
            try {
                misiArray = JSON.parse(createdProfil.misi);
            }
            catch (e) {
                console.error("Error parsing misi JSON:", e);
                misiArray = misi;
            }
            return res.status(201).json({
                message: "Profil desa berhasil dibuat",
                data: {
                    id: createdProfil.id,
                    visi: createdProfil.visi,
                    misi: misiArray,
                    sejarah: createdProfil.sejarah,
                    updated_at: createdProfil.updated_at,
                },
            });
        }
        catch (error) {
            console.error("Error in createProfil:", error);
            return res.status(500).json({
                error: "Gagal membuat profil desa",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
//# sourceMappingURL=profilController.js.map
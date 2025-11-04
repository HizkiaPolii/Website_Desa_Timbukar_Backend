import { ApbdesService } from "../services/apbdesService.js";
export class ApbdesController {
    constructor() {
        this.apbdesService = new ApbdesService();
    }
    async getAll(req, res) {
        try {
            const apbdes = await this.apbdesService.getAll();
            return res.status(200).json({
                message: "Data APBDES berhasil didapatkan",
                data: apbdes,
            });
        }
        catch (error) {
            console.error("Error in getAll:", error);
            return res.status(500).json({ error: "Gagal mendapatkan data APBDES" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            const apbdes = await this.apbdesService.getById(parseInt(id));
            if (!apbdes) {
                return res.status(404).json({ error: "APBDES tidak ditemukan" });
            }
            return res.status(200).json({
                message: "Data APBDES berhasil didapatkan",
                data: apbdes,
            });
        }
        catch (error) {
            console.error("Error in getById:", error);
            return res.status(500).json({ error: "Gagal mendapatkan data APBDES" });
        }
    }
    async getByTahun(req, res) {
        try {
            const { tahun } = req.params;
            if (!tahun) {
                return res.status(400).json({ error: "Tahun tidak valid" });
            }
            const apbdes = await this.apbdesService.getByTahun(parseInt(tahun));
            if (!apbdes) {
                return res
                    .status(404)
                    .json({ error: "APBDES untuk tahun tersebut tidak ditemukan" });
            }
            return res.status(200).json({
                message: "Data APBDES berhasil didapatkan",
                data: apbdes,
            });
        }
        catch (error) {
            console.error("Error in getByTahun:", error);
            return res.status(500).json({ error: "Gagal mendapatkan data APBDES" });
        }
    }
    async getSummary(req, res) {
        try {
            const { tahun } = req.query;
            if (!tahun) {
                return res.status(400).json({ error: "Tahun tidak valid" });
            }
            const summary = await this.apbdesService.getSummary(parseInt(tahun));
            if (!summary) {
                return res.status(404).json({
                    error: "Ringkasan APBDES untuk tahun tersebut tidak ditemukan",
                });
            }
            return res.status(200).json({
                message: "Ringkasan APBDES berhasil didapatkan",
                data: summary,
            });
        }
        catch (error) {
            console.error("Error in getSummary:", error);
            return res
                .status(500)
                .json({ error: "Gagal mendapatkan ringkasan APBDES" });
        }
    }
    async create(req, res) {
        try {
            const { tahun, keterangan, pendapatan, belanja, pembiayaan, file_dokumen: bodyFileDokumen } = req.body;
            // Get file from multer OR from body (from frontend)
            const file_dokumen = req.file
                ? req.file.filename
                : (bodyFileDokumen || null);
            if (!tahun ||
                pendapatan === undefined ||
                belanja === undefined ||
                pembiayaan === undefined) {
                return res.status(400).json({
                    error: "Tahun, pendapatan, belanja, dan pembiayaan harus diisi",
                });
            }
            // file_dokumen opsional (bisa kosong atau null)
            // Tidak perlu validasi ketat
            // Check if tahun already exists
            const existing = await this.apbdesService.getByTahun(parseInt(tahun));
            if (existing) {
                return res
                    .status(409)
                    .json({ error: "APBDES untuk tahun ini sudah ada" });
            }
            const apbdes = await this.apbdesService.create({
                tahun: parseInt(tahun),
                keterangan: keterangan || "",
                pendapatan: parseFloat(pendapatan),
                belanja: parseFloat(belanja),
                pembiayaan: parseFloat(pembiayaan),
                file_dokumen,
            });
            return res.status(201).json({
                message: "APBDES berhasil ditambahkan",
                data: apbdes,
            });
        }
        catch (error) {
            console.error("Error in create:", error);
            return res.status(500).json({ error: "Gagal menambahkan APBDES" });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { tahun, keterangan, pendapatan, belanja, pembiayaan, file_dokumen: bodyFileDokumen } = req.body;
            if (!id) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            // Check if APBDES exists
            const existing = await this.apbdesService.getById(parseInt(id));
            if (!existing) {
                return res.status(404).json({ error: "APBDES tidak ditemukan" });
            }
            // If tahun is being updated, check for duplicates
            if (tahun && tahun !== existing.tahun) {
                const duplicate = await this.apbdesService.getByTahun(parseInt(tahun));
                if (duplicate) {
                    return res
                        .status(409)
                        .json({ error: "APBDES untuk tahun tersebut sudah ada" });
                }
            }
            // Get file from multer (if new file uploaded) OR from body (if sent from frontend)
            const file_dokumen = req.file
                ? req.file.filename
                : (bodyFileDokumen !== undefined ? bodyFileDokumen : undefined);
            const updateData = {};
            if (tahun !== undefined)
                updateData.tahun = parseInt(tahun);
            if (keterangan !== undefined)
                updateData.keterangan = keterangan;
            if (pendapatan !== undefined)
                updateData.pendapatan = parseFloat(pendapatan);
            if (belanja !== undefined)
                updateData.belanja = parseFloat(belanja);
            if (pembiayaan !== undefined)
                updateData.pembiayaan = parseFloat(pembiayaan);
            if (file_dokumen !== undefined)
                updateData.file_dokumen = file_dokumen;
            const apbdes = await this.apbdesService.update(parseInt(id), updateData);
            return res.status(200).json({
                message: "APBDES berhasil diperbarui",
                data: apbdes,
            });
        }
        catch (error) {
            console.error("Error in update:", error);
            return res.status(500).json({ error: "Gagal memperbarui APBDES" });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID tidak valid" });
            }
            // Check if APBDES exists
            const existing = await this.apbdesService.getById(parseInt(id));
            if (!existing) {
                return res.status(404).json({ error: "APBDES tidak ditemukan" });
            }
            await this.apbdesService.delete(parseInt(id));
            return res.status(200).json({
                message: "APBDES berhasil dihapus",
            });
        }
        catch (error) {
            console.error("Error in delete:", error);
            return res.status(500).json({ error: "Gagal menghapus APBDES" });
        }
    }
}
//# sourceMappingURL=apbdesController.js.map
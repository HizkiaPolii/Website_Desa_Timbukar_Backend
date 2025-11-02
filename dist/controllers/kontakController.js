import * as kontakService from "../services/kontakService.js";
// Create new kontak message
export const createKontak = async (req, res) => {
    try {
        const { nama, email, no_telepon, subjek, pesan } = req.body;
        // Validation
        if (!nama || !email || !no_telepon || !subjek || !pesan) {
            res.status(400).json({
                success: false,
                message: "Semua field harus diisi",
            });
            return;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: "Format email tidak valid",
            });
            return;
        }
        const kontak = await kontakService.createKontak({
            nama,
            email,
            no_telepon,
            subjek,
            pesan,
            status: "pending",
        });
        res.status(201).json({
            success: true,
            message: "Pesan kontak berhasil dikirim",
            data: kontak,
        });
    }
    catch (error) {
        console.error("Error in createKontak:", error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat pesan kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Get all kontak messages
export const getAllKontak = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const status = req.query.status;
        const result = await kontakService.getAllKontak(page, limit, search, status);
        res.status(200).json({
            success: true,
            message: "Data kontak berhasil diambil",
            data: result.data,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            },
        });
    }
    catch (error) {
        console.error("Error in getAllKontak:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Get single kontak by ID
export const getKontakById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID kontak harus disediakan",
            });
            return;
        }
        const kontak = await kontakService.getKontakById(parseInt(id));
        if (!kontak) {
            res.status(404).json({
                success: false,
                message: "Kontak tidak ditemukan",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Data kontak berhasil diambil",
            data: kontak,
        });
    }
    catch (error) {
        console.error("Error in getKontakById:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Update kontak status
export const updateKontakStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID kontak harus disediakan",
            });
            return;
        }
        if (!status) {
            res.status(400).json({
                success: false,
                message: "Status harus disediakan",
            });
            return;
        }
        // Validate status
        const validStatus = ["pending", "read", "replied"];
        if (!validStatus.includes(status)) {
            res.status(400).json({
                success: false,
                message: `Status harus salah satu dari: ${validStatus.join(", ")}`,
            });
            return;
        }
        const kontak = await kontakService.updateKontakStatus(parseInt(id), status);
        if (!kontak) {
            res.status(404).json({
                success: false,
                message: "Kontak tidak ditemukan",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Status kontak berhasil diperbarui",
            data: kontak,
        });
    }
    catch (error) {
        console.error("Error in updateKontakStatus:", error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui status kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Delete kontak
export const deleteKontak = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "ID kontak harus disediakan",
            });
            return;
        }
        const success = await kontakService.deleteKontak(parseInt(id));
        if (!success) {
            res.status(404).json({
                success: false,
                message: "Kontak tidak ditemukan",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Kontak berhasil dihapus",
        });
    }
    catch (error) {
        console.error("Error in deleteKontak:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Get kontak statistics
export const getKontakStats = async (req, res) => {
    try {
        const stats = await kontakService.getKontakStats();
        res.status(200).json({
            success: true,
            message: "Statistik kontak berhasil diambil",
            data: stats,
        });
    }
    catch (error) {
        console.error("Error in getKontakStats:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik kontak",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
//# sourceMappingURL=kontakController.js.map
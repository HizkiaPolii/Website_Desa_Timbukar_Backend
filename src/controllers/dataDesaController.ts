import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { getPool } from "../config/connectionPool.js";

export class DataDesaController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const pool = getPool();

      // Query semua data dari database secara parallel
      const [statistics, demographics, gender, education, religion] =
        await Promise.all([
          pool.query("SELECT * FROM desa_statistics LIMIT 1"),
          pool.query("SELECT * FROM desa_demographics ORDER BY id"),
          pool.query("SELECT * FROM desa_gender ORDER BY id"),
          pool.query("SELECT * FROM desa_education ORDER BY id"),
          pool.query("SELECT * FROM desa_religion ORDER BY id"),
        ]);

      // Format data sesuai struktur frontend
      const dataDesa = {
        statistics: {
          id: statistics.rows[0]?.id,
          populasi: statistics.rows[0]?.populasi || "0",
          kepala_keluarga: statistics.rows[0]?.kepala_keluarga || "0",
          luas_wilayah: statistics.rows[0]?.luas_wilayah || "0",
          angka_pertumbuhan: statistics.rows[0]?.angka_pertumbuhan || "0%",
          jumlah_bayi: statistics.rows[0]?.jumlah_bayi || "0",
          angka_harapan_hidup: statistics.rows[0]?.angka_harapan_hidup || "0",
          created_at: statistics.rows[0]?.created_at,
          updated_at: statistics.rows[0]?.updated_at,
        },
        demographics: demographics.rows.map((row) => ({
          id: row.id,
          kategori_usia: row.kategori_usia,
          jumlah: row.jumlah.toString(),
          persentase: row.persentase,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
        gender: gender.rows.map((row) => ({
          id: row.id,
          jenis_kelamin: row.jenis_kelamin,
          jumlah: row.jumlah.toString(),
          persentase: row.persentase,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
        education: education.rows.map((row) => ({
          id: row.id,
          tingkat_pendidikan: row.tingkat_pendidikan,
          jumlah: row.jumlah.toString(),
          persentase: row.persentase,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
        religion: religion.rows.map((row) => ({
          id: row.id,
          agama: row.agama,
          jumlah: row.jumlah.toString(),
          persentase: row.persentase,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
      };

      return res.status(200).json({
        message: "Data desa berhasil didapatkan",
        data: dataDesa,
      });
    } catch (error) {
      console.error("Error fetching data desa:", error);
      return res.status(500).json({ error: "Gagal mendapatkan data desa" });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
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
    } catch (error) {
      console.error("Error fetching data by id:", error);
      return res.status(500).json({ error: "Gagal mendapatkan data desa" });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
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
          if (
            !dataFields.kategori_usia ||
            !dataFields.jumlah ||
            !dataFields.persentase
          ) {
            return res
              .status(400)
              .json({ error: "Field demographics tidak lengkap" });
          }
          result = await pool.query(
            "INSERT INTO desa_demographics (kategori_usia, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *",
            [dataFields.kategori_usia, dataFields.jumlah, dataFields.persentase]
          );
          message = "Data demografi berhasil dibuat";
          break;
        case "gender":
          if (
            !dataFields.jenis_kelamin ||
            !dataFields.jumlah ||
            !dataFields.persentase
          ) {
            return res
              .status(400)
              .json({ error: "Field gender tidak lengkap" });
          }
          result = await pool.query(
            "INSERT INTO desa_gender (jenis_kelamin, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *",
            [dataFields.jenis_kelamin, dataFields.jumlah, dataFields.persentase]
          );
          message = "Data jenis kelamin berhasil dibuat";
          break;
        case "education":
          if (
            !dataFields.tingkat_pendidikan ||
            !dataFields.jumlah ||
            !dataFields.persentase
          ) {
            return res
              .status(400)
              .json({ error: "Field education tidak lengkap" });
          }
          result = await pool.query(
            "INSERT INTO desa_education (tingkat_pendidikan, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *",
            [
              dataFields.tingkat_pendidikan,
              dataFields.jumlah,
              dataFields.persentase,
            ]
          );
          message = "Data pendidikan berhasil dibuat";
          break;
        case "religion":
          if (
            !dataFields.agama ||
            !dataFields.jumlah ||
            !dataFields.persentase
          ) {
            return res
              .status(400)
              .json({ error: "Field religion tidak lengkap" });
          }
          result = await pool.query(
            "INSERT INTO desa_religion (agama, jumlah, persentase) VALUES ($1, $2, $3) RETURNING *",
            [dataFields.agama, dataFields.jumlah, dataFields.persentase]
          );
          message = "Data agama berhasil dibuat";
          break;
        case "statistics":
          if (
            !dataFields.populasi ||
            !dataFields.kepala_keluarga ||
            !dataFields.luas_wilayah ||
            !dataFields.angka_pertumbuhan ||
            !dataFields.jumlah_bayi ||
            !dataFields.angka_harapan_hidup
          ) {
            return res
              .status(400)
              .json({ error: "Field statistics tidak lengkap" });
          }
          result = await pool.query(
            "INSERT INTO desa_statistics (populasi, kepala_keluarga, luas_wilayah, angka_pertumbuhan, jumlah_bayi, angka_harapan_hidup) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [
              dataFields.populasi,
              dataFields.kepala_keluarga,
              dataFields.luas_wilayah,
              dataFields.angka_pertumbuhan,
              dataFields.jumlah_bayi,
              dataFields.angka_harapan_hidup,
            ]
          );
          message = "Data statistik berhasil dibuat";
          break;
        default:
          return res.status(400).json({ error: "Kategori tidak diketahui" });
      }

      return res.status(201).json({
        message,
        data: result?.rows[0],
      });
    } catch (error) {
      console.error("Error creating data desa:", error);
      return res.status(500).json({ error: "Gagal membuat data desa" });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { kategori, ...dataFields } = req.body;
      const pool = getPool();

      if (!kategori) {
        return res.status(400).json({ error: "Kategori harus ditentukan" });
      }

      if (!id) {
        return res.status(400).json({ error: "ID harus ditentukan" });
      }

      let result;
      let message = "";

      // Update database berdasarkan kategori
      switch (kategori) {
        case "demographics":
          result = await pool.query(
            "UPDATE desa_demographics SET kategori_usia = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [
              dataFields.kategori_usia,
              dataFields.jumlah,
              dataFields.persentase,
              id,
            ]
          );
          message = "Data demografi berhasil diperbarui";
          break;
        case "gender":
          result = await pool.query(
            "UPDATE desa_gender SET jenis_kelamin = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [
              dataFields.jenis_kelamin,
              dataFields.jumlah,
              dataFields.persentase,
              id,
            ]
          );
          message = "Data jenis kelamin berhasil diperbarui";
          break;
        case "education":
          result = await pool.query(
            "UPDATE desa_education SET tingkat_pendidikan = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [
              dataFields.tingkat_pendidikan,
              dataFields.jumlah,
              dataFields.persentase,
              id,
            ]
          );
          message = "Data pendidikan berhasil diperbarui";
          break;
        case "religion":
          result = await pool.query(
            "UPDATE desa_religion SET agama = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [dataFields.agama, dataFields.jumlah, dataFields.persentase, id]
          );
          message = "Data agama berhasil diperbarui";
          break;
        case "statistics":
          result = await pool.query(
            "UPDATE desa_statistics SET populasi = $1, kepala_keluarga = $2, luas_wilayah = $3, angka_pertumbuhan = $4, jumlah_bayi = $5, angka_harapan_hidup = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
            [
              dataFields.populasi,
              dataFields.kepala_keluarga,
              dataFields.luas_wilayah,
              dataFields.angka_pertumbuhan,
              dataFields.jumlah_bayi,
              dataFields.angka_harapan_hidup,
              id,
            ]
          );
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
    } catch (error) {
      console.error("Error updating data desa:", error);
      return res.status(500).json({ error: "Gagal memperbarui data desa" });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
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
          result = await pool.query(
            "DELETE FROM desa_demographics WHERE id = $1 RETURNING *",
            [id]
          );
          message = "Data demografi berhasil dihapus";
          break;
        case "gender":
          result = await pool.query(
            "DELETE FROM desa_gender WHERE id = $1 RETURNING *",
            [id]
          );
          message = "Data jenis kelamin berhasil dihapus";
          break;
        case "education":
          result = await pool.query(
            "DELETE FROM desa_education WHERE id = $1 RETURNING *",
            [id]
          );
          message = "Data pendidikan berhasil dihapus";
          break;
        case "religion":
          result = await pool.query(
            "DELETE FROM desa_religion WHERE id = $1 RETURNING *",
            [id]
          );
          message = "Data agama berhasil dihapus";
          break;
        case "statistics":
          result = await pool.query(
            "DELETE FROM desa_statistics WHERE id = $1 RETURNING *",
            [id]
          );
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
    } catch (error) {
      console.error("Error deleting data desa:", error);
      return res.status(500).json({ error: "Gagal menghapus data desa" });
    }
  }

  async updateAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { statistics, demographics, gender, education, religion } =
        req.body;
      const pool = getPool();

      console.log("🔄 [DEBUG] updateAll called with:", {
        statistics: !!statistics,
        demographics: demographics?.length,
        gender: gender?.length,
        education: education?.length,
        religion: religion?.length,
      });

      // Validasi input
      if (!statistics && !demographics && !gender && !education && !religion) {
        return res
          .status(400)
          .json({ error: "Tidak ada data yang akan diupdate" });
      }

      const updatedData = {
        statistics: null as any,
        demographics: [] as any[],
        gender: [] as any[],
        education: [] as any[],
        religion: [] as any[],
      };

      // Update statistics
      if (statistics && statistics.id) {
        const statisticsResult = await pool.query(
          "UPDATE desa_statistics SET populasi = $1, kepala_keluarga = $2, luas_wilayah = $3, angka_pertumbuhan = $4, jumlah_bayi = $5, angka_harapan_hidup = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
          [
            statistics.populasi,
            statistics.kepala_keluarga,
            statistics.luas_wilayah,
            statistics.angka_pertumbuhan,
            statistics.jumlah_bayi,
            statistics.angka_harapan_hidup,
            statistics.id,
          ]
        );

        if (statisticsResult.rows.length > 0) {
          updatedData.statistics = statisticsResult.rows[0];
          console.log("✅ [DEBUG] Statistics updated");
        }
      }

      // Update demographics
      if (
        demographics &&
        Array.isArray(demographics) &&
        demographics.length > 0
      ) {
        for (const item of demographics) {
          if (item.id) {
            const demographicsResult = await pool.query(
              "UPDATE desa_demographics SET kategori_usia = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
              [item.kategori_usia, item.jumlah, item.persentase, item.id]
            );

            if (demographicsResult.rows.length > 0) {
              updatedData.demographics.push(demographicsResult.rows[0]);
            }
          }
        }
        console.log(
          "✅ [DEBUG] Demographics updated:",
          updatedData.demographics.length,
          "items"
        );
      }

      // Update gender
      if (gender && Array.isArray(gender) && gender.length > 0) {
        for (const item of gender) {
          if (item.id) {
            const genderResult = await pool.query(
              "UPDATE desa_gender SET jenis_kelamin = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
              [item.jenis_kelamin, item.jumlah, item.persentase, item.id]
            );

            if (genderResult.rows.length > 0) {
              updatedData.gender.push(genderResult.rows[0]);
            }
          }
        }
        console.log(
          "✅ [DEBUG] Gender updated:",
          updatedData.gender.length,
          "items"
        );
      }

      // Update education
      if (education && Array.isArray(education) && education.length > 0) {
        for (const item of education) {
          if (item.id) {
            const educationResult = await pool.query(
              "UPDATE desa_education SET tingkat_pendidikan = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
              [item.tingkat_pendidikan, item.jumlah, item.persentase, item.id]
            );

            if (educationResult.rows.length > 0) {
              updatedData.education.push(educationResult.rows[0]);
            }
          }
        }
        console.log(
          "✅ [DEBUG] Education updated:",
          updatedData.education.length,
          "items"
        );
      }

      // Update religion
      if (religion && Array.isArray(religion) && religion.length > 0) {
        for (const item of religion) {
          if (item.id) {
            const religionResult = await pool.query(
              "UPDATE desa_religion SET agama = $1, jumlah = $2, persentase = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
              [item.agama, item.jumlah, item.persentase, item.id]
            );

            if (religionResult.rows.length > 0) {
              updatedData.religion.push(religionResult.rows[0]);
            }
          }
        }
        console.log(
          "✅ [DEBUG] Religion updated:",
          updatedData.religion.length,
          "items"
        );
      }

      return res.status(200).json({
        message: "Semua data desa berhasil diperbarui",
        data: updatedData,
      });
    } catch (error) {
      console.error("❌ [DEBUG] Error in updateAll:", error);
      return res.status(500).json({
        error: "Gagal memperbarui data desa",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

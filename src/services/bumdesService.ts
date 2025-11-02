import { getPool } from "../config/connectionPool.js";
import type { QueryResult } from "pg";

export interface BumdesData {
  id: number;
  nama_bumdes: string;
  deskripsi: string;
  jenis_usaha: string;
  alamat: string;
  no_telepon: string;
  pimpinan: string;
  gambar: string;
  created_at: Date;
  updated_at: Date;
}

export class BumdesService {
  /**
   * Mendapatkan semua data BUMDES
   */
  async getAll(): Promise<BumdesData[]> {
    try {
      const pool = getPool();
      const result: QueryResult<BumdesData> = await pool.query(
        "SELECT * FROM bumdes ORDER BY id ASC"
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching all bumdes:", error);
      throw error;
    }
  }

  /**
   * Mendapatkan BUMDES berdasarkan ID
   */
  async getById(id: number): Promise<BumdesData | null> {
    try {
      const pool = getPool();
      const result: QueryResult<BumdesData> = await pool.query(
        "SELECT * FROM bumdes WHERE id = $1",
        [id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching bumdes by id:", error);
      throw error;
    }
  }

  /**
   * Membuat data BUMDES baru
   */
  async create(
    data: Omit<BumdesData, "id" | "created_at" | "updated_at">
  ): Promise<BumdesData> {
    try {
      const pool = getPool();
      const {
        nama_bumdes,
        deskripsi,
        jenis_usaha,
        alamat,
        no_telepon,
        pimpinan,
        gambar,
      } = data;

      const result: QueryResult<BumdesData> = await pool.query(
        `INSERT INTO bumdes (nama_bumdes, deskripsi, jenis_usaha, alamat, no_telepon, pimpinan, gambar, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [
          nama_bumdes,
          deskripsi,
          jenis_usaha,
          alamat,
          no_telepon,
          pimpinan,
          gambar,
        ]
      );

      return result.rows[0] as BumdesData;
    } catch (error) {
      console.error("Error creating bumdes:", error);
      throw error;
    }
  }

  /**
   * Update data BUMDES
   */
  async update(
    id: number,
    data: Partial<Omit<BumdesData, "id" | "created_at" | "updated_at">>
  ): Promise<BumdesData | null> {
    try {
      const pool = getPool();

      // Build dynamic UPDATE query based on provided fields
      const fields = Object.keys(data) as (keyof typeof data)[];
      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      const setClauses = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");
      const values: (string | number | boolean)[] = fields.map(
        (field) => data[field] as string | number | boolean
      );
      values.push(id);

      const idPlaceholder = fields.length + 1;

      const result: QueryResult<BumdesData> = await pool.query(
        `UPDATE bumdes SET ${setClauses}, updated_at = NOW() WHERE id = $${idPlaceholder} RETURNING *`,
        values
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating bumdes:", error);
      throw error;
    }
  }

  /**
   * Menghapus data BUMDES
   */
  async delete(id: number): Promise<boolean> {
    try {
      const pool = getPool();
      const result: QueryResult = await pool.query(
        "DELETE FROM bumdes WHERE id = $1",
        [id]
      );

      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error deleting bumdes:", error);
      throw error;
    }
  }
}

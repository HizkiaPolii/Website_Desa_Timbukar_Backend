import { getPool } from "../config/connectionPool.js";
import { QueryResult } from "pg";

export interface Kontak {
  id?: number;
  nama: string;
  email: string;
  no_telepon: string;
  subjek: string;
  pesan: string;
  status?: string;
  created_at?: Date;
}

// Create new kontak message
export const createKontak = async (kontak: Kontak): Promise<Kontak> => {
  try {
    const pool = getPool();
    const query = `
      INSERT INTO kontak (nama, email, no_telepon, subjek, pesan, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, nama, email, no_telepon, subjek, pesan, status, created_at
    `;

    const values = [
      kontak.nama,
      kontak.email,
      kontak.no_telepon,
      kontak.subjek,
      kontak.pesan,
      kontak.status || "pending",
    ];

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating kontak:", error);
    throw error;
  }
};

// Get all kontak messages with pagination and search
export const getAllKontak = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<{ data: Kontak[]; total: number; page: number; limit: number }> => {
  try {
    const pool = getPool();
    let query = "SELECT * FROM kontak WHERE 1=1";
    const values: any[] = [];
    let valueIndex = 1;

    // Search filter
    if (search) {
      query += ` AND (nama ILIKE $${valueIndex} OR email ILIKE $${valueIndex} OR subjek ILIKE $${valueIndex})`;
      values.push(`%${search}%`);
      valueIndex++;
    }

    // Status filter
    if (status) {
      query += ` AND status = $${valueIndex}`;
      values.push(status);
      valueIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM kontak WHERE 1=1`;
    let countQueryWithFilters = countQuery;
    let countValues: any[] = [];

    if (search) {
      countQueryWithFilters += ` AND (nama ILIKE $1 OR email ILIKE $1 OR subjek ILIKE $1)`;
      countValues.push(`%${search}%`);
    }

    if (status) {
      const statusIndex = countValues.length + 1;
      countQueryWithFilters += ` AND status = $${statusIndex}`;
      countValues.push(status);
    }

    const countResult: QueryResult = await pool.query(
      countQueryWithFilters,
      countValues
    );
    const total = parseInt(countResult.rows[0].total);

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${valueIndex} OFFSET $${
      valueIndex + 1
    }`;
    values.push(limit);
    values.push((page - 1) * limit);

    const result: QueryResult = await pool.query(query, values);

    return {
      data: result.rows,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching kontak:", error);
    throw error;
  }
};

// Get single kontak by ID
export const getKontakById = async (id: number): Promise<Kontak | null> => {
  try {
    const pool = getPool();
    const query = "SELECT * FROM kontak WHERE id = $1";
    const result: QueryResult = await pool.query(query, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching kontak by ID:", error);
    throw error;
  }
};

// Update kontak status
export const updateKontakStatus = async (
  id: number,
  status: string
): Promise<Kontak | null> => {
  try {
    const pool = getPool();
    const query = `
      UPDATE kontak 
      SET status = $1
      WHERE id = $2
      RETURNING id, nama, email, no_telepon, subjek, pesan, status, created_at
    `;

    const result: QueryResult = await pool.query(query, [status, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error updating kontak status:", error);
    throw error;
  }
};

// Delete kontak
export const deleteKontak = async (id: number): Promise<boolean> => {
  try {
    const pool = getPool();
    const query = "DELETE FROM kontak WHERE id = $1";
    const result: QueryResult = await pool.query(query, [id]);

    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error("Error deleting kontak:", error);
    throw error;
  }
};

// Get kontak statistics
export const getKontakStats = async (): Promise<any> => {
  try {
    const pool = getPool();
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied
      FROM kontak
    `;

    const result: QueryResult = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching kontak statistics:", error);
    throw error;
  }
};

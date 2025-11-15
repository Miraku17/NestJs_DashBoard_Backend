import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async getAllTablesData() {
    // 1. Get all table names
    const tables = await this.dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE';
    `);

    const excludedTables = ['company_forms', 'users']; // tables to skip
    const result: Record<string, any[]> = {};

    for (const table of tables) {
      const tableName = table.table_name;

      // Skip excluded tables
      if (excludedTables.includes(tableName)) continue;

      // Fetch limited rows to avoid token limits
      const rows = await this.dataSource.query(
        `SELECT * FROM "${tableName}" LIMIT 50`,
      );

      result[tableName] = rows;
    }

    return result;
  }
}

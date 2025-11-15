import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  // Get total row count for all tables except some excluded ones
  async getTableCounts() {
    try {
      console.log('[DatabaseService] Fetching table names...');

      const excludedTables = ['company_forms', 'users']; // skip tables if needed

      // Get all table names
      const tables: { table_name: string }[] = await this.dataSource.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public' AND table_type='BASE TABLE';
      `);

      console.log(`[DatabaseService] Found tables: ${tables.map(t => t.table_name).join(', ')}`);

      const result: Record<string, number> = {};

      for (const table of tables) {
        const tableName = table.table_name;

        if (excludedTables.includes(tableName)) {
          console.log(`[DatabaseService] Skipping table: ${tableName}`);
          continue;
        }

        console.log(`[DatabaseService] Counting rows in table: ${tableName}...`);

        const countResult = await this.dataSource.query(
          `SELECT COUNT(*) as count FROM "${tableName}"`
        );

        const count = parseInt(countResult[0].count, 10);
        console.log(`[DatabaseService] Table: ${tableName}, Rows: ${count}`);

        result[tableName] = count;
      }

      console.log('[DatabaseService] Completed fetching table counts.');
      return { status: 'success', data: result };
    } catch (error) {
      console.error('[DatabaseService] Error fetching table counts:', error);
      throw new InternalServerErrorException('Failed to fetch table counts');
    }
  }
}

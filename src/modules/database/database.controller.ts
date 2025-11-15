import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get('counts')
  @ApiOperation({ summary: 'Get total number of rows for each table' })
  @ApiResponse({
    status: 200,
    description: 'Returns total rows for each table',
    schema: {
      example: {
        forms: 120,
        customer: 50,
        engine: 15,
        company: 8,
      },
    },
  })
  async getTableCounts() {
    console.log('[DatabaseController] /database/counts endpoint called');
    const counts = await this.dbService.getTableCounts();
    console.log('[DatabaseController] Table counts fetched:', counts);
    return counts;
  }
}

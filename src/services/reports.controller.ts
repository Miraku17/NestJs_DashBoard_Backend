// src/controllers/reports.controller.ts
import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import { ServiceReportDto } from './dto/service-report.dto';
@Controller('reports')
export class ReportsController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('service-report/pdf')
  async generateServiceReportPdf(
    @Body() serviceReportData: ServiceReportDto,
    @Res() res,
  ) {
    try {
      const pdfBuffer = await this.pdfService.generateServiceReport(serviceReportData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="service-report-${Date.now()}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error generating PDF',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
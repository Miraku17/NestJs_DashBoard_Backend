import { Controller, Get, Param, ParseUUIDPipe, Header, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Readable } from 'stream';
import { FormsService } from 'src/modules/forms/forms.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly formsService: FormsService,
  ) {}

  @Get('service-report/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=service-report.pdf')
  async getServiceReport(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    // 1️⃣ Fetch the form
    const formResponse = await this.formsService.findOne(id);
    const form = formResponse.data;

    // 2️⃣ Flatten data for Handlebars template
    const templateData = {
      job_order: form.job_order,
      dateCreated: form.dateCreated,
      basicInformation: form.data.basicInformation || {},
      engineInformation: form.data.engineInformation || {},
      serviceDetails: form.data.serviceDetails || {},
      warrantyCoverage: form.data.warrantyCoverage || {},
      serviceSummary: form.data.serviceSummary || {},
      signatures: form.data.signatures || {},
      companyForm: form.companyForm || {},
    };

    console.log("Template Data:", templateData);

    // 3️⃣ Generate PDF buffer
    const pdfBuffer = await this.pdfService.generateServiceReportPdf(templateData);

    // 4️⃣ Convert Buffer to StreamableFile
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    return new StreamableFile(stream);
  }
}

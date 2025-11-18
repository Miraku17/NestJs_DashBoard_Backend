import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Readable } from 'stream';
import { FormsService } from 'src/modules/forms/forms.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly formsService: FormsService,
  ) {}

  @Get('report/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=report.pdf')
  @ApiOperation({ summary: 'Generate a PDF for a given form ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the form',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'PDF file generated successfully',
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Form not found' })
  async getReport(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    // 1️⃣ Fetch the form
    const formResponse = await this.formsService.findOne(id);
    if (!formResponse.success) {
      throw new Error('Form not found');
    }
    const form = formResponse.data;

    // 2️⃣ Flatten data for Handlebars template
    const templateData = {
      job_order: form.job_order,
      dateCreated: form.dateCreated,

      basicInformation: form.data.basicInformation || {},
      engineInformation: form.data.engineInformation || {},

      // Newly added sections
      inspection: form.data.inspection || {},
      testRun: form.data.testRun || '',
      engineParameters: form.data.engineParameters || {},
      parts: form.data.parts || {},
      remarks: form.data.remarks || '',
      recommendation: form.data.recommendation || '',

      serviceDetails: form.data.serviceDetails || {},
      warrantyCoverage: form.data.warrantyCoverage || {},
      serviceSummary: form.data.servicesSummary || {},
      signatures: form.data.signatures || {},

      companyForm: form.companyForm || {},
    };

    console.log('Template Data:', templateData);

    // 3️⃣ Determine template based on formType
    const templateMap = {
      Service: 'ServiceDeutz',
      Commission: 'CommissionDeutz',
    };
    const templateName = templateMap[form.companyForm.formType];

    if (!templateName) {
      throw new Error('Unsupported form type');
    }

    // 4️⃣ Generate PDF buffer
    const pdfBuffer = await this.pdfService.generatePdf(
      templateName,
      templateData,
    );

    // 5️⃣ Convert Buffer to StreamableFile
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    return new StreamableFile(stream);
  }
}

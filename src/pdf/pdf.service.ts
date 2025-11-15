import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf-node';

@Injectable()
export class PdfService {
  private templatesPath = './src/pdf/templates';

  async generateServiceReportPdf(data: any): Promise<Buffer> {
    // 1️⃣ Load HTML template
    const templateHtml = await fs.readFile(
      `${this.templatesPath}/ServiceDeutz.html`,
      'utf8',
    );

    // 2️⃣ Compile with Handlebars
    const template = Handlebars.compile(templateHtml);
    const html = template(data);

    // 3️⃣ PDF options
    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm',
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    };

    // 4️⃣ Generate PDF
    const file = { content: html };
    const pdfBuffer = await pdf.generatePdf(file, options);

    return Buffer.from(pdfBuffer);
  }
}

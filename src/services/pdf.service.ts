// src/services/pdf.service.ts
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { ServiceReportDto } from './dto/service-report.dto';

@Injectable()
export class PdfService {
  // Color scheme for consistent branding
  private readonly colors = {
    primary: '#1E40AF',      // Professional blue
    secondary: '#64748B',    // Slate gray
    accent: '#3B82F6',       // Lighter blue
    text: '#1F2937',         // Dark gray
    textLight: '#6B7280',    // Medium gray
    border: '#E5E7EB',       // Light gray
    background: '#F9FAFB',   // Very light gray
  };

  async generateServiceReport(data: ServiceReportDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          margin: 40,
          size: 'A4',
          bufferPages: true
        });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Build the PDF content
        this.buildServiceReportPDF(doc, data);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private buildServiceReportPDF(doc: PDFKit.PDFDocument, data: ServiceReportDto) {
    // Header with company branding
    this.addHeader(doc);
    
    // Title with accent bar
    this.addTitle(doc);
    
    // Basic Information Section
    this.addSection(doc, 'Basic Information', () => {
      this.addFormFields(doc, data);
    });
    
    // Service Details Section
    this.addSection(doc, 'Service Details', () => {
      this.addTextAreas(doc, data);
    });
    
    // Warranty Information Section
    this.addSection(doc, 'Warranty Information', () => {
      this.addWarrantyInfo(doc, data);
    });
    
    // Signature section
    this.addSignatureSection(doc);
    
    // Footer with page numbers
    this.addFooter(doc);
  }

  private addHeader(doc: PDFKit.PDFDocument) {
    // Company name with background accent
    doc.rect(40, 40, doc.page.width - 80, 80)
       .fillAndStroke(this.colors.background, this.colors.border);
    
    doc.fillColor(this.colors.primary)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Power Systems, Incorporated', 60, 55);
    
    doc.fillColor(this.colors.textLight)
       .fontSize(9)
       .font('Helvetica')
       .text('2nd Floor TOPY\'s Place #3 Calle Industria cor. Economia Street,', 60, 75)
       .text('Bagumbayan, Libis, Quezon City', 60, 88)
       .text('Tel. Nos.: (+63-2) 687-9275 to 78', 60, 101);
    
    // Add date on the right side
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.fillColor(this.colors.text)
       .fontSize(9)
       .text(`Generated: ${currentDate}`, doc.page.width - 200, 55, { 
         width: 140, 
         align: 'right' 
       });
    
    doc.moveDown(3);
  }

  private addTitle(doc: PDFKit.PDFDocument) {
    const titleY = doc.y + 20;
    
    // Accent bar
    doc.rect(40, titleY - 5, 6, 30)
       .fill(this.colors.accent);
    
    // Title
    doc.fillColor(this.colors.primary)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('Service Report', 55, titleY, { align: 'left' });
    
    doc.moveDown(2);
  }

  private addSection(doc: PDFKit.PDFDocument, title: string, contentCallback: () => void) {
    // Check if we need a new page
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }
    
    // Section header with background
    const sectionY = doc.y + 10;
    doc.rect(40, sectionY, doc.page.width - 80, 25)
       .fill(this.colors.background);
    
    doc.fillColor(this.colors.primary)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(title, 50, sectionY + 8);
    
    doc.moveDown(1.5);
    
    // Execute content callback
    contentCallback();
    
    doc.moveDown(1);
  }

  private addFormFields(doc: PDFKit.PDFDocument, data: ServiceReportDto) {
    const fieldConfig = [
      { label: 'Name (Reporting Person)', value: data.reportingPerson, width: 0.5 },
      { label: 'Telephone/Fax', value: data.telephoneFax, width: 0.5 },
      { label: 'Equipment Manufacturer', value: data.equipmentManufacturer, width: 0.5 },
      { label: 'Job Order', value: data.jobOrder, width: 0.5 },
      { label: 'Customer', value: data.customer, width: 0.5 },
      { label: 'Contact Person', value: data.contactPerson, width: 0.5 },
      { label: 'Address', value: data.address, width: 0.5 },
      { label: 'Email Address', value: data.emailAddress, width: 0.5 },
      { label: 'Engine Model', value: data.engineModel, width: 0.5 },
      { label: 'Engine Serial No.', value: data.engineSerialNo, width: 0.5 },
      { label: 'Main Alternator', value: data.mainAlternator, width: 0.5 },
      { label: 'Equipment Model', value: data.equipmentModel, width: 0.5 },
      { label: 'Equipment Serial No.', value: data.equipmentSerialNo, width: 0.5 },
      { label: 'Alternator Serial No.', value: data.alternatorSerialNo, width: 0.5 },
      { label: 'Location', value: data.location, width: 0.5 },
      { label: 'Date in Service', value: data.dateInService, width: 0.5 },
      { label: 'Rating', value: data.rating, width: 0.33 },
      { label: 'Revolution', value: data.revolution, width: 0.33 },
      { label: 'Starting Voltage', value: data.startingVoltage, width: 0.33 },
      { label: 'Running Hours', value: data.runningHours, width: 0.5 },
      { label: 'Fuel Pump S/N', value: data.fuelPumpSN, width: 0.5 },
      { label: 'Fuel Pump Code', value: data.fuelPumpCode, width: 0.5 },
      { label: 'Lube Oil Type', value: data.lubeOilType, width: 0.5 },
      { label: 'Fuel Type', value: data.fuelType, width: 0.5 },
      { label: 'Cooling Water Additives', value: data.coolingWaterAdditives, width: 0.5 },
      { label: 'Date Failed', value: data.dateFailed, width: 0.5 },
      { label: 'Turbo Model', value: data.turboModel, width: 0.5 },
      { label: 'Turbo S/N', value: data.turboSN, width: 0.5 },
    ];
  
    const pageWidth = doc.page.width - 80;
    let currentX = 50;
    let currentY = doc.y;
    let rowStartY = currentY;
  
    fieldConfig.forEach((field, index) => {
      const fieldWidth = pageWidth * field.width - 10;
      
      // Add field
      this.addStyledField(doc, field.label, field.value, currentX, currentY, fieldWidth);
      
      // Calculate next position
      currentX += fieldWidth + 10;
      
      // Check if we need to move to next row
      if (field.width === 1 || (index < fieldConfig.length - 1 && 
          currentX + (pageWidth * fieldConfig[index + 1].width) > doc.page.width - 30)) {
        currentX = 50;
        currentY += 48;
        rowStartY = currentY;
      }
    });
  
    doc.y = currentY + 48;
  }


  private addStyledField(
    doc: PDFKit.PDFDocument, 
    label: string, 
    value: string, 
    x: number, 
    y: number, 
    width: number
  ) {
    // Label
    doc.fillColor(this.colors.textLight)
       .fontSize(8)
       .font('Helvetica-Bold')
       .text(label.toUpperCase(), x, y);
    
    // Value box with border
    doc.rect(x, y + 12, width, 28)
       .strokeColor(this.colors.border)
       .lineWidth(1)
       .stroke();
    
    // Value text
    doc.fillColor(this.colors.text)
       .fontSize(10)
       .font('Helvetica')
       .text(value || '—', x + 8, y + 20, { 
         width: width - 16,
         height: 20,
         ellipsis: true 
       });
  }

  private addTextAreas(doc: PDFKit.PDFDocument, data: ServiceReportDto) {
    // Customer's Complaint
    this.addStyledTextArea(
      doc, 
      'Customer\'s Complaint', 
      data.customerComplaint,
      80
    );
    
    // Possible Cause
    this.addStyledTextArea(
      doc, 
      'Possible Cause', 
      data.possibleCause,
      80
    );
    
    // Summary Details
    this.addStyledTextArea(
      doc, 
      'Summary Details', 
      data.summaryDetails,
      80
    );
  }

  
  private addStyledTextArea(
    doc: PDFKit.PDFDocument, 
    label: string, 
    content: string, 
    height: number
  ) {
    const y = doc.y;
    const width = doc.page.width - 80;
    
    // Label
    doc.fillColor(this.colors.textLight)
       .fontSize(8)
       .font('Helvetica-Bold')
       .text(label.toUpperCase(), 50, y);
    
    // Content box
    doc.rect(50, y + 15, width, height)
       .strokeColor(this.colors.border)
       .fillAndStroke(this.colors.background, this.colors.border);
    
    // Content text
    doc.fillColor(this.colors.text)
       .fontSize(10)
       .font('Helvetica')
       .text(content || 'No information provided', 58, y + 23, { 
         width: width - 16,
         height: height - 16
       });
    
    doc.y = y + height + 25;
  }

  private addWarrantyInfo(doc: PDFKit.PDFDocument, data: ServiceReportDto) {
    const y = doc.y;
    const boxWidth = (doc.page.width - 100) / 2;
    
    // Within Coverage box
    this.addCheckboxField(
      doc,
      'Unit Within Coverage Period?',
      data.withinCoverage,
      50,
      y,
      boxWidth
    );
    
    // Warrantable Failure box
    this.addCheckboxField(
      doc,
      'Warrantable Failure?',
      data.warrantableFailure,
      50 + boxWidth + 20,
      y,
      boxWidth
    );
    
    doc.y = y + 70;
  }

  private addCheckboxField(
    doc: PDFKit.PDFDocument,
    label: string,
    checked: boolean,
    x: number,
    y: number,
    width: number
  ) {
    // Background box
    doc.rect(x, y, width, 60)
       .fillAndStroke(this.colors.background, this.colors.border);
    
    // Label
    doc.fillColor(this.colors.textLight)
       .fontSize(8)
       .font('Helvetica-Bold')
       .text(label.toUpperCase(), x + 10, y + 10);
    
    // Yes/No options
    const checkboxY = y + 30;
    
    // Yes checkbox
    this.drawCheckbox(doc, x + 10, checkboxY, checked === true);
    doc.fillColor(this.colors.text)
       .fontSize(10)
       .font('Helvetica')
       .text('Yes', x + 30, checkboxY + 1);
    
    // No checkbox
    this.drawCheckbox(doc, x + 80, checkboxY, checked === false);
    doc.fillColor(this.colors.text)
       .text('No', x + 100, checkboxY + 1);
  }

  private drawCheckbox(doc: PDFKit.PDFDocument, x: number, y: number, checked: boolean) {
    // Checkbox border
    doc.rect(x, y, 14, 14)
       .strokeColor(this.colors.border)
       .lineWidth(1.5)
       .stroke();
    
    // Check mark if checked
    if (checked) {
      doc.fillColor(this.colors.accent)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('✓', x + 2, y, { width: 14, align: 'center' });
    }
  }

  private addSignatureSection(doc: PDFKit.PDFDocument) {
    // Check if we need a new page
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }
    
    const signatureY = doc.y + 30;
    const sectionWidth = (doc.page.width - 110) / 3;
    
    // Section title
    doc.fillColor(this.colors.primary)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('Signatures', 50, signatureY);
    
    doc.moveDown(2);
    
    // Three signature boxes
    this.addSignatureBox(
      doc,
      'Service Technician',
      '',
      50,
      doc.y,
      sectionWidth
    );
    
    this.addSignatureBox(
      doc,
      'Approved By',
      'F.B Sumera / A.C Hubilla / A.O Mongaya\nService Supervisor/Manager',
      50 + sectionWidth + 15,
      signatureY + 35,
      sectionWidth
    );
    
    this.addSignatureBox(
      doc,
      'Acknowledged By',
      'Customer\'s Representative',
      50 + (sectionWidth + 15) * 2,
      signatureY + 35,
      sectionWidth
    );
  }

  private addSignatureBox(
    doc: PDFKit.PDFDocument,
    title: string,
    subtitle: string,
    x: number,
    y: number,
    width: number
  ) {
    // Box
    doc.rect(x, y, width, 80)
       .strokeColor(this.colors.border)
       .stroke();
    
    // Title
    doc.fillColor(this.colors.textLight)
       .fontSize(8)
       .font('Helvetica-Bold')
       .text(title.toUpperCase(), x + 10, y + 8);
    
    // Signature line
    doc.moveTo(x + 10, y + 50)
       .lineTo(x + width - 10, y + 50)
       .strokeColor(this.colors.border)
       .stroke();
    
    // Subtitle/Name
    if (subtitle) {
      doc.fillColor(this.colors.text)
         .fontSize(7)
         .font('Helvetica')
         .text(subtitle, x + 10, y + 55, { 
           width: width - 20, 
           align: 'center' 
         });
    }
  }

  private addFooter(doc: PDFKit.PDFDocument) {
    const pages = doc.bufferedPageRange();
    
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      // Footer line
      doc.moveTo(40, doc.page.height - 50)
         .lineTo(doc.page.width - 40, doc.page.height - 50)
         .strokeColor(this.colors.border)
         .lineWidth(0.5)
         .stroke();
      
      // Page number
      doc.fillColor(this.colors.textLight)
         .fontSize(8)
         .text(
           `Page ${i + 1} of ${pages.count}`,
           40,
           doc.page.height - 40,
           { align: 'center', width: doc.page.width - 80 }
         );
      
      // Footer text
      doc.text(
        'This is a computer-generated document. No signature required.',
        40,
        doc.page.height - 30,
        { align: 'center', width: doc.page.width - 80 }
      );
    }
  }
}
import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { FormsModule } from 'src/modules/forms/forms.module';

@Module({
  imports: [FormsModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
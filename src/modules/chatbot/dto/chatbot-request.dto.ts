import { ApiProperty } from '@nestjs/swagger';

export class ChatbotRequestDto {
  @ApiProperty({ description: 'The question to ask the chatbot', example: 'List all forms for today' })
  question: string;
}

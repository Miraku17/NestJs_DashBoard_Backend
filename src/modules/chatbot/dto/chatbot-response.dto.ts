import { ApiProperty } from '@nestjs/swagger';

export class ChatbotResponseDto {
  @ApiProperty({ description: 'The answer returned by ChatGPT', example: 'Here are the forms: ...' })
  answer: string;
}

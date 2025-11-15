import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

// DTO for request body
import { ChatbotRequestDto } from './dto/chatbot-request.dto';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({ summary: 'Ask a question to the chatbot' })
  @ApiBody({ type: ChatbotRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Answer returned from ChatGPT',
    type: ChatbotResponseDto,
  })
  async chat(@Body() body: ChatbotRequestDto) {
    const answer = await this.chatbotService.answerQuestion(body.question);
    return { answer };
  }
}

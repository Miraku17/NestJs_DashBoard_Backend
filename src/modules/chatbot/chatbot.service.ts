import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { DatabaseService } from './database.service';

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor(private readonly dbService: DatabaseService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async answerQuestion(question: string) {
    const allTables = await this.dbService.getAllTablesData();

    const prompt = `
You are a helpful assistant. Answer the question using the following database tables:

${JSON.stringify(allTables, null, 2)}

User question: ${question}
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  }
}

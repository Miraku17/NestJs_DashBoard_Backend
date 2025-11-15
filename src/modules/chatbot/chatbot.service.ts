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

    // Updated prompt to be human-readable
    const prompt = `
You are a friendly and helpful assistant. Answer the user's question in a clear, natural, and easy-to-understand way. 
Do not just list raw data or technical field names; instead, summarize and explain the information like a human would. 
Use complete sentences and proper formatting.

Here is the relevant database information:

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

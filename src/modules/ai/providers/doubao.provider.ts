import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class DoubaoProvider {
  private readonly client: AxiosInstance;
  private readonly apiKey: string;
  private readonly endpoint: string;

  constructor() {
    this.apiKey = process.env.DOUBAO_API_KEY || 'sk-8P6t0TghhbB6hN2B3jFb616MKiamRr2EkhT5uxlI6uQRiqUO';
    this.endpoint = process.env.DOUBAO_API_ENDPOINT || 'https://www.dmxapi.cn/v1';

    this.client = axios.create({
      baseURL: this.endpoint,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    axiosRetry(this.client, {
      retries: 3,
      retryDelay: (retryCount) => retryCount * 1000,
      retryCondition: (error) => {
        return error.response?.status === 429 || error.response?.status >= 500;
      },
    });
  }

  async generate(prompt: string, model: string = 'doubao-seed-2.0-pro-free'): Promise<string> {
    try {
      const response = await this.client.post('/chat/completions', {
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的小说创作助手，擅长生成高质量的小说内容。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      });

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Doubao API error:', error?.response?.data || error.message);
      throw new Error(`豆包大模型API调用失败: ${error?.response?.data?.error?.message || error.message}`);
    }
  }

  async generateStream(prompt: string, model: string = 'doubao-seed-2.0-pro-free'): Promise<AsyncGenerator<string>> {
    const self = this;

    async function* generateStreamGenerator(): AsyncGenerator<string> {
      try {
        const response = await self.client.post(
          '/chat/completions',
          {
            model: model,
            messages: [
              {
                role: 'system',
                content: '你是一位专业的小说创作助手，擅长生成高质量的小说内容。',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 8192,
            stream: true,
          },
          {
            responseType: 'stream',
          },
        );

        const stream = response.data as unknown as AsyncIterable<Buffer>;
        let buffer = '';

        for await (const chunk of stream) {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  yield content;
                }
              } catch (e) {
              }
            }
          }
        }
      } catch (error) {
        console.error('Doubao stream error:', error?.response?.data || error.message);
        throw new Error(`豆包大模型流式调用失败: ${error?.message}`);
      }
    }

    return generateStreamGenerator();
  }

  async getModels(): Promise<Array<{ id: string; name: string; type: string }>> {
    return [
      { id: 'doubao-seed-2.0-pro-free', name: '豆包Seed 2.0 Pro免费版', type: 'cloud' },
    ];
  }
}

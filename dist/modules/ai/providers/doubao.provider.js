"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubaoProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
let DoubaoProvider = class DoubaoProvider {
    constructor() {
        this.apiKey = process.env.DOUBAO_API_KEY || 'sk-8P6t0TghhbB6hN2B3jFb616MKiamRr2EkhT5uxlI6uQRiqUO';
        this.endpoint = process.env.DOUBAO_API_ENDPOINT || 'https://www.dmxapi.cn/v1';
        this.client = axios_1.default.create({
            baseURL: this.endpoint,
            timeout: 120000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
        });
        (0, axios_retry_1.default)(this.client, {
            retries: 3,
            retryDelay: (retryCount) => retryCount * 1000,
            retryCondition: (error) => {
                return error.response?.status === 429 || error.response?.status >= 500;
            },
        });
    }
    async generate(prompt, model = 'doubao-seed-2.0-pro-free') {
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
        }
        catch (error) {
            console.error('Doubao API error:', error?.response?.data || error.message);
            throw new Error(`豆包大模型API调用失败: ${error?.response?.data?.error?.message || error.message}`);
        }
    }
    async generateStream(prompt, model = 'doubao-seed-2.0-pro-free') {
        const self = this;
        async function* generateStreamGenerator() {
            try {
                const response = await self.client.post('/chat/completions', {
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
                }, {
                    responseType: 'stream',
                });
                const stream = response.data;
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
                            }
                            catch (e) {
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error('Doubao stream error:', error?.response?.data || error.message);
                throw new Error(`豆包大模型流式调用失败: ${error?.message}`);
            }
        }
        return generateStreamGenerator();
    }
    async getModels() {
        return [
            { id: 'doubao-seed-2.0-pro-free', name: '豆包Seed 2.0 Pro免费版', type: 'cloud' },
        ];
    }
};
exports.DoubaoProvider = DoubaoProvider;
exports.DoubaoProvider = DoubaoProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DoubaoProvider);
//# sourceMappingURL=doubao.provider.js.map
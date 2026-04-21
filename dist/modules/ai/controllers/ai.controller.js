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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("../services/ai.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const common_2 = require("@nestjs/common");
let AIController = class AIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateFramework(dto) {
        const content = await this.aiService.generateFramework(dto);
        return {
            status: 'success',
            message: '生成成功',
            data: {
                framework: JSON.parse(content),
            },
        };
    }
    async generateFrameworkStream(dto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        try {
            const stream = await this.aiService.generateFrameworkStream(dto);
            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
        }
        catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
    async generateChapter(dto) {
        const content = await this.aiService.generateChapter(dto);
        return {
            status: 'success',
            message: '生成成功',
            data: { content },
        };
    }
    async generateChapterStream(dto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        try {
            const stream = await this.aiService.generateChapterStream(dto);
            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
        }
        catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
    async optimizeContent(dto) {
        const content = await this.aiService.optimizeContent(dto);
        return {
            status: 'success',
            message: '优化成功',
            data: { optimizedContent: content },
        };
    }
    async expandPolish(dto) {
        const result = await this.aiService.expandPolish(dto);
        return {
            status: 'success',
            message: '处理成功',
            data: {
                result,
                originalLength: dto.content.length,
                expandedLength: result.length,
            },
        };
    }
    async continueWrite(dto) {
        const content = await this.aiService.continueWrite(dto);
        return {
            status: 'success',
            message: '续写成功',
            data: {
                candidates: [
                    {
                        id: '1',
                        content,
                        score: 0.95,
                    },
                ],
            },
        };
    }
    async analyzeWork(dto) {
        const result = await this.aiService.analyzeWork(dto);
        return {
            status: 'success',
            message: '分析成功',
            data: JSON.parse(result),
        };
    }
    async toolboxGenerate(dto) {
        const content = await this.aiService.toolboxGenerate(dto);
        return {
            status: 'success',
            message: '生成成功',
            data: {
                results: [
                    {
                        id: '1',
                        content,
                        score: 0.9,
                    },
                ],
            },
        };
    }
    async getPrompts(category, keyword, page = 1, pageSize = 20) {
        const prompts = [
            {
                id: '1',
                title: '角色描写模板',
                category: 'role',
                content: '创建一个立体、有深度的角色，包括其背景故事、性格特点、行为模式和成长轨迹...',
                usageCount: 1000,
                rating: 4.9,
            },
            {
                id: '2',
                title: '场景描写模板',
                category: 'scene',
                content: '用丰富的感官描写创建一个身临其境的场景，包括视觉、听觉、嗅觉等多维度...',
                usageCount: 800,
                rating: 4.8,
            },
        ];
        const filtered = prompts.filter(p => {
            if (category && p.category !== category)
                return false;
            if (keyword && !p.title.includes(keyword))
                return false;
            return true;
        });
        return {
            status: 'success',
            message: '获取成功',
            data: {
                items: filtered,
                total: filtered.length,
                page,
                pageSize,
            },
        };
    }
    async getStyles() {
        const styles = [
            { id: '1', name: '古风仙侠', description: '古代仙侠世界的故事', tags: ['古风', '仙侠'], example: '天地玄黄，宇宙洪荒...' },
            { id: '2', name: '现代都市', description: '现代都市背景的故事', tags: ['现代', '都市'], example: '霓虹灯下，车水马龙...' },
            { id: '3', name: '未来科幻', description: '未来科技世界的故事', tags: ['科幻', '未来'], example: '公元2150年，地球联邦...' },
            { id: '4', name: '奇幻冒险', description: '奇幻世界的冒险故事', tags: ['奇幻', '冒险'], example: '在遥远的魔法大陆...' },
            { id: '5', name: '悬疑推理', description: '悬疑推理类型的故事', tags: ['悬疑', '推理'], example: '雨夜，废弃的古宅...' },
            { id: '6', name: '历史架空', description: '历史背景的架空故事', tags: ['历史', '架空'], example: '如果三国时代...' },
            { id: '7', name: '浪漫爱情', description: '浪漫爱情故事', tags: ['爱情', '浪漫'], example: '春风十里，不如你...' },
            { id: '8', name: '青春校园', description: '校园青春故事', tags: ['校园', '青春'], example: '操场上，汗水与笑声...' },
            { id: '9', name: '赛博朋克', description: '赛博朋克风格故事', tags: ['赛博', '朋克'], example: '霓虹与数据的交织...' },
            { id: '10', name: '蒸汽朋克', description: '蒸汽朋克风格故事', tags: ['蒸汽', '朋克'], example: '齿轮与蒸汽的轰鸣...' },
            { id: '11', name: '西方魔幻', description: '西方奇幻背景故事', tags: ['魔幻', '西方'], example: '在遥远的阿尔特里亚大陆...' },
            { id: '12', name: '东方玄幻', description: '东方玄幻风格故事', tags: ['玄幻', '东方'], example: '修真世界，强者为尊...' },
        ];
        return {
            status: 'success',
            message: '获取成功',
            data: styles,
        };
    }
    async getModels() {
        return {
            status: 'success',
            message: '获取成功',
            data: [
                { id: 'doubao-seed-2.0-pro-free', name: '豆包Seed 2.0 Pro免费版', description: '高性能云端模型', type: 'cloud' },
            ],
        };
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('generate/framework'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '生成小说框架' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '生成成功' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '认证失败' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '参数无效' }),
    (0, swagger_1.ApiResponse)({ status: 402, description: '积分不足' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateFramework", null);
__decorate([
    (0, common_1.Post)('generate/framework/stream'),
    (0, swagger_1.ApiOperation)({ summary: '流式生成小说框架' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '流式生成成功' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateFrameworkStream", null);
__decorate([
    (0, common_1.Post)('generate/chapter'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '生成章节内容' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '生成成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateChapter", null);
__decorate([
    (0, common_1.Post)('generate/chapter/stream'),
    (0, swagger_1.ApiOperation)({ summary: '流式生成章节内容' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '流式生成成功' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateChapterStream", null);
__decorate([
    (0, common_1.Post)('optimize'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '优化内容' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "optimizeContent", null);
__decorate([
    (0, common_1.Post)('expand-polish'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI扩写润色' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "expandPolish", null);
__decorate([
    (0, common_1.Post)('continue-write'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI续写' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "continueWrite", null);
__decorate([
    (0, common_1.Post)('analyze-work'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI拆书分析' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "analyzeWork", null);
__decorate([
    (0, common_1.Post)('toolbox/generate'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '创意工具箱生成' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "toolboxGenerate", null);
__decorate([
    (0, common_1.Get)('prompts'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '获取提示词列表' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('keyword')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getPrompts", null);
__decorate([
    (0, common_1.Get)('styles'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '获取风格列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getStyles", null);
__decorate([
    (0, common_1.Get)('models'),
    (0, swagger_1.ApiOperation)({ summary: '获取可用AI模型' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getModels", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], AIController);
//# sourceMappingURL=ai.controller.js.map
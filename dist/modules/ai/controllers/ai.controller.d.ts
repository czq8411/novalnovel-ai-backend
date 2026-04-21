import { Response } from 'express';
import { AIService, GenerateFrameworkDto, GenerateChapterDto, OptimizeContentDto, ExpandPolishDto, ContinueWriteDto, AnalyzeWorkDto, ToolboxGenerateDto } from '../services/ai.service';
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    generateFramework(dto: GenerateFrameworkDto): Promise<{
        status: string;
        message: string;
        data: {
            framework: any;
        };
    }>;
    generateFrameworkStream(dto: GenerateFrameworkDto, res: Response): Promise<void>;
    generateChapter(dto: GenerateChapterDto): Promise<{
        status: string;
        message: string;
        data: {
            content: string;
        };
    }>;
    generateChapterStream(dto: GenerateChapterDto, res: Response): Promise<void>;
    optimizeContent(dto: OptimizeContentDto): Promise<{
        status: string;
        message: string;
        data: {
            optimizedContent: string;
        };
    }>;
    expandPolish(dto: ExpandPolishDto): Promise<{
        status: string;
        message: string;
        data: {
            result: string;
            originalLength: number;
            expandedLength: number;
        };
    }>;
    continueWrite(dto: ContinueWriteDto): Promise<{
        status: string;
        message: string;
        data: {
            candidates: {
                id: string;
                content: string;
                score: number;
            }[];
        };
    }>;
    analyzeWork(dto: AnalyzeWorkDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    toolboxGenerate(dto: ToolboxGenerateDto): Promise<{
        status: string;
        message: string;
        data: {
            results: {
                id: string;
                content: string;
                score: number;
            }[];
        };
    }>;
    getPrompts(category?: string, keyword?: string, page?: number, pageSize?: number): Promise<{
        status: string;
        message: string;
        data: {
            items: {
                id: string;
                title: string;
                category: string;
                content: string;
                usageCount: number;
                rating: number;
            }[];
            total: number;
            page: number;
            pageSize: number;
        };
    }>;
    getStyles(): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            name: string;
            description: string;
            tags: string[];
            example: string;
        }[];
    }>;
    getModels(): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            name: string;
            description: string;
            type: string;
        }[];
    }>;
}

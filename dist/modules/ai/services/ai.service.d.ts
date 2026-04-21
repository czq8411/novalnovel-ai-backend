import { DoubaoProvider } from '../providers/doubao.provider';
export interface GenerateFrameworkDto {
    title: string;
    type: string;
    wordCount: number;
    plot: string;
    characters: string;
}
export interface GenerateChapterDto {
    novelId: string;
    chapterTitle: string;
    chapterOutline: string;
    context: string;
}
export interface OptimizeContentDto {
    content: string;
    instructions: string;
}
export interface ExpandPolishDto {
    content: string;
    mode: 'expand' | 'polish';
    level: number;
}
export interface ContinueWriteDto {
    novelId: string;
    chapterId: string;
    content: string;
    length: number;
    style: string;
}
export interface AnalyzeWorkDto {
    title: string;
    content: string;
    analysisType: 'structure' | 'plot' | 'technique' | 'all';
}
export interface ToolboxGenerateDto {
    type: 'bookname' | 'synopsis' | 'outline' | 'detail-outline' | 'opening' | 'plot-twist' | 'name' | 'character';
    params: {
        genre?: string;
        style?: string;
        keywords?: string[];
        context?: string;
    };
}
export declare class AIService {
    private readonly doubaoProvider;
    constructor(doubaoProvider: DoubaoProvider);
    generateFramework(dto: GenerateFrameworkDto): Promise<string>;
    generateChapter(dto: GenerateChapterDto): Promise<string>;
    optimizeContent(dto: OptimizeContentDto): Promise<string>;
    expandPolish(dto: ExpandPolishDto): Promise<string>;
    continueWrite(dto: ContinueWriteDto): Promise<string>;
    analyzeWork(dto: AnalyzeWorkDto): Promise<string>;
    toolboxGenerate(dto: ToolboxGenerateDto): Promise<string>;
    generateFrameworkStream(dto: GenerateFrameworkDto): AsyncGenerator<string, void, any>;
    generateChapterStream(dto: GenerateChapterDto): AsyncGenerator<string, void, any>;
    private buildFrameworkPrompt;
    private buildChapterPrompt;
    private buildToolboxPrompt;
}

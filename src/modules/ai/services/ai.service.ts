import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AIService {
  constructor(private readonly doubaoProvider: DoubaoProvider) {}

  async generateFramework(dto: GenerateFrameworkDto) {
    const prompt = this.buildFrameworkPrompt(dto);
    return this.doubaoProvider.generate(prompt);
  }

  async generateChapter(dto: GenerateChapterDto) {
    const prompt = this.buildChapterPrompt(dto);
    return this.doubaoProvider.generate(prompt);
  }

  async optimizeContent(dto: OptimizeContentDto) {
    const prompt = `请优化以下内容：\n${dto.content}\n\n优化要求：${dto.instructions}`;
    return this.doubaoProvider.generate(prompt);
  }

  async expandPolish(dto: ExpandPolishDto) {
    const prompt = dto.mode === 'expand'
      ? `请扩写以下内容，保持风格一致：\n${dto.content}`
      : `请润色以下内容，提升文字表现力：\n${dto.content}`;
    return this.doubaoProvider.generate(prompt);
  }

  async continueWrite(dto: ContinueWriteDto) {
    const prompt = `请续写以下内容，保持风格和语调一致，续写${dto.length}字：\n${dto.content}`;
    return this.doubaoProvider.generate(prompt);
  }

  async analyzeWork(dto: AnalyzeWorkDto) {
    const prompt = `请分析以下作品（${dto.title}）：\n${dto.content}\n\n分析类型：${dto.analysisType}`;
    return this.doubaoProvider.generate(prompt);
  }

  async toolboxGenerate(dto: ToolboxGenerateDto) {
    const prompt = this.buildToolboxPrompt(dto);
    return this.doubaoProvider.generate(prompt);
  }

  async *generateFrameworkStream(dto: GenerateFrameworkDto) {
    const prompt = this.buildFrameworkPrompt(dto);
    const stream = await this.doubaoProvider.generateStream(prompt);
    yield* stream;
  }

  async *generateChapterStream(dto: GenerateChapterDto) {
    const prompt = this.buildChapterPrompt(dto);
    const stream = await this.doubaoProvider.generateStream(prompt);
    yield* stream;
  }

  private buildFrameworkPrompt(dto: GenerateFrameworkDto): string {
    return `
请为小说《${dto.title}》生成详细的故事框架。

小说类型：${dto.type}
预期字数：${dto.wordCount}字
核心情节：${dto.plot}
人物设定：${dto.characters}

请生成包含以下内容的详细框架：
1. 故事大纲（总纲）
2. 章节结构（列出主要章节标题）
3. 情节节点（主要情节点及其顺序）
4. 人物关系（主要人物及其关系）

请以JSON格式返回。
`.trim();
  }

  private buildChapterPrompt(dto: GenerateChapterDto): string {
    return `
请为小说章节"${dto.chapterTitle}"生成内容。

章节大纲：${dto.chapterOutline}

上下文：${dto.context}

请生成符合上述要求的章节内容，保持与上下文的一致性。
`.trim();
  }

  private buildToolboxPrompt(dto: ToolboxGenerateDto): string {
    const typePrompts = {
      'bookname': `请为${dto.params.genre}类型的小说生成10个吸引人的书名候选。`,
      'synopsis': `请为小说"${dto.params.context}"生成一个简洁有力的简介。`,
      'outline': `请为${dto.params.genre}类型的小说生成完整的故事大纲。`,
      'detail-outline': `请为章节"${dto.params.context}"生成详细的章节细纲。`,
      'opening': `请为${dto.params.style}风格的小说生成一个引人入胜的开篇。`,
      'plot-twist': `在以下情节基础上，请设计一个出人意料但合理的情节转折：\n${dto.params.context}`,
      'name': `请为以下角色/场景生成10个独特贴切的名称：\n${dto.params.context}`,
      'character': `请为以下角色定位生成一个立体饱满的角色设定：\n${dto.params.context}`,
    };

    return typePrompts[dto.type] || '请生成内容';
  }
}

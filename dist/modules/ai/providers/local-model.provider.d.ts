export declare class LocalModelProvider {
    private modelPath;
    private modelType;
    private process;
    constructor();
    generate(prompt: string): Promise<string>;
    private generateWithLlama;
    private generateWithMLC;
    generateStream(prompt: string): AsyncGenerator<any, void, unknown>;
    private generateStreamWithLlama;
    private generateStreamWithMLC;
    getModels(): Promise<Array<{
        id: string;
        name: string;
        type: string;
    }>>;
    stop(): void;
}

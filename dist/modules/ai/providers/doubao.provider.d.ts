export declare class DoubaoProvider {
    private readonly client;
    private readonly apiKey;
    private readonly endpoint;
    constructor();
    generate(prompt: string, model?: string): Promise<string>;
    generateStream(prompt: string, model?: string): Promise<AsyncGenerator<string>>;
    getModels(): Promise<Array<{
        id: string;
        name: string;
        type: string;
    }>>;
}

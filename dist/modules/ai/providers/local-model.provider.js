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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalModelProvider = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
let LocalModelProvider = class LocalModelProvider {
    constructor() {
        this.process = null;
        this.modelPath = process.env.LOCAL_MODEL_PATH || './models/llama-7b.bin';
        this.modelType = process.env.LOCAL_MODEL_TYPE || 'llama';
    }
    async generate(prompt) {
        if (this.modelType === 'llama') {
            return this.generateWithLlama(prompt);
        }
        else {
            return this.generateWithMLC(prompt);
        }
    }
    async generateWithLlama(prompt) {
        return new Promise((resolve, reject) => {
            const args = [
                '-m', this.modelPath,
                '-p', prompt,
                '-n', '512',
                '--temp', '0.7',
            ];
            this.process = (0, child_process_1.spawn)('./llama.cpp/main', args);
            let output = '';
            let errorOutput = '';
            if (this.process.stdout) {
                this.process.stdout.on('data', (data) => {
                    output += data.toString();
                });
            }
            if (this.process.stderr) {
                this.process.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
            }
            this.process.on('close', (code) => {
                if (code === 0) {
                    resolve(output.trim());
                }
                else {
                    reject(new Error(`Llama inference failed: ${errorOutput}`));
                }
            });
            this.process.on('error', (err) => {
                reject(err);
            });
        });
    }
    async generateWithMLC(prompt) {
        return new Promise((resolve, reject) => {
            const args = [
                '--model', this.modelPath,
                '--prompt', prompt,
                '--max-new-tokens', '512',
                '--temperature', '0.7',
            ];
            this.process = (0, child_process_1.spawn)('mlc_llm.chat', args);
            let output = '';
            let errorOutput = '';
            if (this.process.stdout) {
                this.process.stdout.on('data', (data) => {
                    output += data.toString();
                });
            }
            if (this.process.stderr) {
                this.process.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
            }
            this.process.on('close', (code) => {
                if (code === 0) {
                    resolve(output.trim());
                }
                else {
                    reject(new Error(`MLC inference failed: ${errorOutput}`));
                }
            });
            this.process.on('error', (err) => {
                reject(err);
            });
        });
    }
    async *generateStream(prompt) {
        if (this.modelType === 'llama') {
            yield* this.generateStreamWithLlama(prompt);
        }
        else {
            yield* this.generateStreamWithMLC(prompt);
        }
    }
    async *generateStreamWithLlama(prompt) {
        const args = [
            '-m', this.modelPath,
            '-p', prompt,
            '-n', '512',
            '--temp', '0.7',
            '--stream', 'stdout',
        ];
        const process = (0, child_process_1.spawn)('./llama.cpp/main', args);
        const stdout = process.stdout;
        for await (const chunk of stdout) {
            yield chunk.toString();
        }
    }
    async *generateStreamWithMLC(prompt) {
        const args = [
            '--model', this.modelPath,
            '--prompt', prompt,
            '--max-new-tokens', '512',
            '--temperature', '0.7',
        ];
        const process = (0, child_process_1.spawn)('mlc_llm.chat', args);
        const stdout = process.stdout;
        for await (const chunk of stdout) {
            yield chunk.toString();
        }
    }
    async getModels() {
        return [
            { id: 'llama-7b', name: 'Llama 7B', type: 'local' },
            { id: 'mistral-7b', name: 'Mistral 7B', type: 'local' },
        ];
    }
    stop() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
    }
};
exports.LocalModelProvider = LocalModelProvider;
exports.LocalModelProvider = LocalModelProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalModelProvider);
//# sourceMappingURL=local-model.provider.js.map
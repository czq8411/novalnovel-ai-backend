import { Injectable } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import { Readable } from 'stream';

@Injectable()
export class LocalModelProvider {
  private modelPath: string;
  private modelType: 'mlc' | 'llama';
  private process: ChildProcess | null = null;

  constructor() {
    this.modelPath = process.env.LOCAL_MODEL_PATH || './models/llama-7b.bin';
    this.modelType = (process.env.LOCAL_MODEL_TYPE as 'mlc' | 'llama') || 'llama';
  }

  async generate(prompt: string): Promise<string> {
    if (this.modelType === 'llama') {
      return this.generateWithLlama(prompt);
    } else {
      return this.generateWithMLC(prompt);
    }
  }

  private async generateWithLlama(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        '-m', this.modelPath,
        '-p', prompt,
        '-n', '512',
        '--temp', '0.7',
      ];

      this.process = spawn('./llama.cpp/main', args);

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
        } else {
          reject(new Error(`Llama inference failed: ${errorOutput}`));
        }
      });

      this.process.on('error', (err) => {
        reject(err);
      });
    });
  }

  private async generateWithMLC(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        '--model', this.modelPath,
        '--prompt', prompt,
        '--max-new-tokens', '512',
        '--temperature', '0.7',
      ];

      this.process = spawn('mlc_llm.chat', args);

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
        } else {
          reject(new Error(`MLC inference failed: ${errorOutput}`));
        }
      });

      this.process.on('error', (err) => {
        reject(err);
      });
    });
  }

  async *generateStream(prompt: string) {
    if (this.modelType === 'llama') {
      yield* this.generateStreamWithLlama(prompt);
    } else {
      yield* this.generateStreamWithMLC(prompt);
    }
  }

  private async *generateStreamWithLlama(prompt: string) {
    const args = [
      '-m', this.modelPath,
      '-p', prompt,
      '-n', '512',
      '--temp', '0.7',
      '--stream', 'stdout',
    ];

    const process = spawn('./llama.cpp/main', args);
    const stdout = process.stdout as Readable;

    for await (const chunk of stdout) {
      yield chunk.toString();
    }
  }

  private async *generateStreamWithMLC(prompt: string) {
    const args = [
      '--model', this.modelPath,
      '--prompt', prompt,
      '--max-new-tokens', '512',
      '--temperature', '0.7',
    ];

    const process = spawn('mlc_llm.chat', args);
    const stdout = process.stdout as Readable;

    for await (const chunk of stdout) {
      yield chunk.toString();
    }
  }

  async getModels(): Promise<Array<{ id: string; name: string; type: string }>> {
    return [
      { id: 'llama-7b', name: 'Llama 7B', type: 'local' },
      { id: 'mistral-7b', name: 'Mistral 7B', type: 'local' },
    ];
  }

  stop(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

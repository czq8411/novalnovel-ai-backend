import { Module } from '@nestjs/common';
import { AIController } from './controllers/ai.controller';
import { AIService } from './services/ai.service';
import { DoubaoProvider } from './providers/doubao.provider';

@Module({
  controllers: [AIController],
  providers: [AIService, DoubaoProvider],
  exports: [AIService],
})
export class AIModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NovelDocument = Novel & Document;

@Schema({ timestamps: true })
export class Novel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  synopsis: string;

  @Prop()
  coverImage: string;

  @Prop({ default: 0 })
  wordCount: number;

  @Prop({ default: 'draft' })
  status: 'draft' | 'writing' | 'completed' | 'published';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop()
  tags: string[];

  @Prop()
  characters: string;

  @Prop()
  plotOutline: string;

  @Prop()
  framework: string;

  @Prop({ default: 0 })
  chapterCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;
}

export const NovelSchema = SchemaFactory.createForClass(Novel);

NovelSchema.index({ authorId: 1 });
NovelSchema.index({ status: 1 });
NovelSchema.index({ createdAt: -1 });

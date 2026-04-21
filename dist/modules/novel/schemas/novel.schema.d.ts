import { Document, Types } from 'mongoose';
export type NovelDocument = Novel & Document;
export declare class Novel {
    title: string;
    type: string;
    synopsis: string;
    coverImage: string;
    wordCount: number;
    status: 'draft' | 'writing' | 'completed' | 'published';
    authorId: Types.ObjectId;
    tags: string[];
    characters: string;
    plotOutline: string;
    framework: string;
    chapterCount: number;
    viewCount: number;
    likeCount: number;
}
export declare const NovelSchema: import("mongoose").Schema<Novel, import("mongoose").Model<Novel, any, any, any, Document<unknown, any, Novel, any, {}> & Novel & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Novel, Document<unknown, {}, import("mongoose").FlatRecord<Novel>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Novel> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

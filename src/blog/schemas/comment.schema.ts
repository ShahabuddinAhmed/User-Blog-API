import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Article } from './article.schema';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Comment {
  @Prop({ required: true, type: String, index: 'text', trim: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true })
  parent: string;

  @Prop({ type: Types.ObjectId, ref: 'Article' })
  article: Article;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

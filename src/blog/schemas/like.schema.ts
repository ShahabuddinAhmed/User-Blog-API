import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Article } from './article.schema';

export type LikeDocument = Like & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Like {
  @Prop({ required: true, type: Boolean })
  isLike: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Article' })
  article: Article;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

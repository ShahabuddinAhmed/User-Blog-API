import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';
import { User } from '../../user/schemas/user.schema';

export type ArticleDocument = Article & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Article {
  @Prop({ required: true, type: String, trim: true })
  title: string;

  @Prop({ required: false, type: String, trim: true })
  subTitle: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ required: true, type: Text })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

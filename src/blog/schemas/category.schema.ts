import { Article } from './article.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Category {
  @Prop({ required: true, type: String, index: 'text', trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop([
    { type: Types.ObjectId, ref: 'Article', required: false, default: [] },
  ])
  articles: Article[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

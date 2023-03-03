import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const CategorySchema = SchemaFactory.createForClass(Category);

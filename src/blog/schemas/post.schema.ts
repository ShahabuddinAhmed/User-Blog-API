import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { User, UserDocument } from './user.schema';
import { Comment, CommentDocument } from './comment.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, type: String, trim: true })
  title: string;

  @Prop({ required: false, type: String, trim: true })
  subTitle: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ required: true, type: Text })
  content: string;

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  comments: CommentDocument[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: CategoryDocument;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const PostSchema = SchemaFactory.createForClass(Post);

import { ArticleInterface } from "./article";
import { Schema, model, Types } from "mongoose";
import { UserInterface } from "./user";

export interface CommentInterface {
  id?: typeof Types.ObjectId | string;
  content: string;
  parentId: typeof Types.ObjectId;
  article: typeof Types.ObjectId | string | ArticleInterface;
  user: typeof Types.ObjectId | string | UserInterface;
}

const schema = new Schema<CommentInterface>(
  {
    content: { type: String, required: true, trim: true },
    parentId: [{ type: Types.ObjectId, required: true }],
    article: { type: Types.ObjectId, ref: "Article", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

export const CommentModel = model<CommentInterface>("Comment", schema);

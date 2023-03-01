import { ArticleInterface } from "./article";
import { Schema, model, Types } from "mongoose";
import { UserInterface } from "./user";

export interface LikeInterface {
  id?: typeof Types.ObjectId | string;
  isLike: boolean;
  parentId: typeof Types.ObjectId;
  article: typeof Types.ObjectId | string | ArticleInterface;
  user: typeof Types.ObjectId | string | UserInterface;
}

const schema = new Schema<LikeInterface>(
  {
    isLike: { type: Boolean, required: true },
    parentId: [{ type: Types.ObjectId, required: true }],
    article: [{ type: Types.ObjectId, ref: "Article", required: true }],
    user: [{ type: Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true, versionKey: false }
);

export const LikeModel = model<LikeInterface>("Like", schema);

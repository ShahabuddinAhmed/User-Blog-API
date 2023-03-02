import { CommentInterface } from "./comment";
import { CategoryInterface } from "./category";
import { UserInterface } from "./user";

import { Schema, model, Types } from "mongoose";

export interface ArticleInterface {
  id?: typeof Types.ObjectId | string;
  title: string;
  subTitle: string;
  slug: string;
  content: string;
  comments: [typeof Types.ObjectId | string | CommentInterface];
  category: typeof Types.ObjectId | string | CategoryInterface;
  user: typeof Types.ObjectId | string | UserInterface;
}

const schema = new Schema<ArticleInterface>(
  {
    title: { type: String, required: true, trim: true },
    subTitle: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    comments: [
      {
        type: Types.ObjectId,
        ref: "Comment",
        required: true,
        localField: "comments",
        foreignField: "parent",
      },
    ],
    category: { type: Types.ObjectId, ref: "Category", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

export const ArticleModel = model<ArticleInterface>("Article", schema);

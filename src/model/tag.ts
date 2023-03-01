import { Schema, model, Types } from "mongoose";

export interface TagInterface {
  id?: typeof Types.ObjectId | string;
  title: string;
  slug: string;
}

const schema = new Schema<TagInterface>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const TagModel = model<TagInterface>("Tag", schema);

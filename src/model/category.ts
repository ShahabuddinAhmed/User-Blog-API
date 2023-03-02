import { Schema, model, Types } from "mongoose";

export interface CategoryInterface {
  id?: typeof Types.ObjectId | string;
  name: string;
  slug: string;
}

const schema = new Schema<CategoryInterface>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

schema.index({ name: "text" });

export const CategoryModel = model<CategoryInterface>("Category", schema);

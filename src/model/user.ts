import { Schema, model, Types } from "mongoose";
import { ArticleInterface } from "./article";

export enum SortType {
  ASC = "ASC",
  DESC = "DESC",
}

export interface UserInterface {
  id?: typeof Types.ObjectId | string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobile: string;
  address: string;
}

const schema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: false, trim: true },
    password: { type: String, required: true, min: 8 },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: false, trim: true },
    address: { type: String, required: false, trim: true },
  },
  { timestamps: true, versionKey: false }
);

schema.index({ email: 1 });

export const UserModel = model<UserInterface>("User", schema);

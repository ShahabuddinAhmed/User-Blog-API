import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, type: String, trim: true })
  firstName: string;

  @Prop({ required: false, type: String, trim: true })
  lastName: string;

  @Prop({ required: true, type: String, min: 8 })
  password: string;

  @Prop({ required: true, type: String, unique: true, index: 1 })
  email: string;

  @Prop({ required: false, type: String, trim: true })
  mobile: string;

  @Prop({ required: true, type: String, trim: true })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

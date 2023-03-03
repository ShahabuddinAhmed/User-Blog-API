import { LikeDocument } from './../schemas/like.schema';
import { Exclude, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

class Like {
  isLike: boolean;
  article: string;

  @Exclude()
  _id: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class LikeSerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: LikeDocument,
    errors: any,
  ) {
    super(statusCode, code, message, plainToClass(Like, data), errors);
  }
}

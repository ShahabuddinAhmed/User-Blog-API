import { Exclude, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { CommentDocument } from '../schemas/Comment.schema';

class Comment {
  name: string;
  slug: string;

  @Exclude()
  _id: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class CommentSerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: CommentDocument,
    errors: any,
  ) {
    super(statusCode, code, message, plainToClass(Comment, data), errors);
  }
}

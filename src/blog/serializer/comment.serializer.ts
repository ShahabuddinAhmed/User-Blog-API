import { Exclude, plainToClass, Type } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { CommentDocument } from '../schemas/comment.schema';

class Comment {
  @Type(() => String)
  _id: string;

  @Type(() => String)
  parent: string;

  name: string;
  slug: string;

  @Exclude()
  user: string;

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

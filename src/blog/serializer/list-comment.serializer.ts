import {
  Exclude,
  plainToClass,
  Type,
  plainToInstance,
} from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { CommentDocument } from '../schemas/comment.schema';

class User {
  firstName: string;
  lastName: string;

  @Exclude()
  _id: string;
}

class Comment {
  @Type(() => String)
  _id: string;

  @Type(() => String)
  parent: string;

  @Type(() => User)
  user: User;

  name: string;
  slug: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class ListCommentSerializer extends AppSerializer {
  offset: number;
  limit: number;
  count: number;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: CommentDocument[],
    errors: any,
    optional?: Record<string, unknown>,
  ) {
    super(statusCode, code, message, plainToInstance(Comment, data), errors);
    this.offset = optional.offset as number;
    this.limit = optional.limit as number;
    this.count = optional.count as number;
  }
}

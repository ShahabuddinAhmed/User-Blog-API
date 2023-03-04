import { LikeDocument } from './../../blog/schemas/like.schema';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

class Article {
  title: string;
  subTitle: string;
  slug: string;

  @Exclude()
  _id: string;
}

class Like {
  @Type(() => String)
  _id: string;

  isLike: boolean;

  @Type(() => Article)
  article: Article;

  @Exclude()
  user: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class ListLikeSerializer extends AppSerializer {
  offset: number;
  limit: number;
  count: number;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: LikeDocument[],
    errors: any,
    optional?: Record<string, unknown>,
  ) {
    super(statusCode, code, message, plainToInstance(Like, data), errors);
    this.offset = optional.offset as number;
    this.limit = optional.limit as number;
    this.count = optional.count as number;
  }
}

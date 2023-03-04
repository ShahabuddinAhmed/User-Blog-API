import { ArticleDocument } from './../schemas/article.schema';
import { Exclude, plainToInstance, Type } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

class ListArticle {
  @Type(() => String)
  _id: string;
  title: string;
  subTitle: string;
  slug: string;
  content: string;

  @Exclude()
  user: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class ListArticleSerializer extends AppSerializer {
  offset: number;
  limit: number;
  count: number;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: ArticleDocument[],
    errors: any,
    optional?: Record<string, unknown>,
  ) {
    super(
      statusCode,
      code,
      message,
      plainToInstance(ListArticle, data),
      errors,
    );
    this.offset = optional.offset as number;
    this.limit = optional.limit as number;
    this.count = optional.count as number;
  }
}

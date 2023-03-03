import { ArticleDocument } from './../schemas/article.schema';
import { Exclude, plainToClass, Type } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

class Article {
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

export class ArticleSerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: ArticleDocument,
    errors: any,
  ) {
    super(statusCode, code, message, plainToClass(Article, data), errors);
  }
}

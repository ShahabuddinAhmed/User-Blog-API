import { ArticleDocument } from './../schemas/article.schema';
import { Exclude, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

class Article {
  title: string;
  subTitle: string;
  slug: string;
  content: string;

  @Exclude()
  _id: string;

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

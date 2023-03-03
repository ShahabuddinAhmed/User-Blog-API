import { Exclude, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { CategoryDocument } from '../schemas/category.schema';

class Category {
  name: string;
  slug: string;

  @Exclude()
  _id: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class CategorySerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: CategoryDocument,
    errors: any,
  ) {
    super(statusCode, code, message, plainToClass(Category, data), errors);
  }
}

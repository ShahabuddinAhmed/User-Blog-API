import { Exclude, plainToClass, Type } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { CategoryDocument } from '../schemas/category.schema';

export class SearchCategorySerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: CategoryDocument[],
    errors: any,
  ) {
    super(statusCode, code, message, data, errors);
  }
}

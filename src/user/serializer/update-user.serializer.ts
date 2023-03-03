import { Exclude, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';
import { User } from '../schemas/user.schema';

class UserSerializer {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;

  @Exclude()
  _id: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export class UpdateUserSerializer extends AppSerializer {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: User,
    errors: any,
  ) {
    super(
      statusCode,
      code,
      message,
      plainToClass(UserSerializer, data),
      errors,
    );
  }
}

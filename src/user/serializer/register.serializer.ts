import { User, UserDocument } from './../schemas/user.schema';
import { Exclude, Type, plainToClass } from 'class-transformer';
import { AppSerializer } from '../../app.serializer';

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

export class RegisterSerializer extends AppSerializer {
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

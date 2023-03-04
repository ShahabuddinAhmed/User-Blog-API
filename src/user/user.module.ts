import { LikeSchema } from './../blog/schemas/like.schema';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        collection: 'user',
        schema: UserSchema,
      },
      {
        name: 'Like',
        collection: 'like',
        schema: LikeSchema,
      },
    ]),
    PassportModule.registerAsync({
      useFactory: () => ({
        defaultStrategy: 'jwt',
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION },
      }),
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [
    UserService,
    // MongooseModule.forFeature([
    //   {
    //     name: 'User',
    //     collection: 'user',
    //     schema: UserSchema,
    //   },
    // ]),
  ],
})
export class UserModule {}

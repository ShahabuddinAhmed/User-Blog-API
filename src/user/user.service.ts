import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '../logger/logger.service';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private userModel: Model<UserDocument>, // private readonly loggerService: LoggerService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; errMessage: string }> {
    const existUser = await this.getUser({ email: registerDto.email });
    if (existUser) {
      return { user: null, errMessage: 'User Already Exist' };
    }

    const password = await this.hashPassword(registerDto.password);
    const createdUser = await this.userModel.create({
      ...registerDto,
      password,
    });
    return {
      user: createdUser.toObject() as User,
      errMessage: '',
    };
  }

  public async login(
    req: Request,
    ip: string,
    loginUserDto: LoginDto,
  ): Promise<{ user: User | null; accessToken: string; errMessage: string }> {
    const user = await this.getUser({ email: loginUserDto.email });
    if (!user) {
      return { user: null, accessToken: '', errMessage: 'No user was found' };
    }

    const isMatchPassword = await this.checkPassword(
      loginUserDto.password,
      user.password,
    );
    if (!isMatchPassword) {
      return { user: null, accessToken: '', errMessage: 'Invalid credentials' };
    }

    const accessToken = await this.createAccessToken(user, req, ip);
    return { user, accessToken, errMessage: '' };
  }

  public async update(
    jwtPayloadDto: JwtPayloadDto,
    updateUser: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: jwtPayloadDto.userId },
      updateUser,
      {
        new: true,
      },
    );
  }

  private async getUser(
    predicate: Record<string, unknown>,
  ): Promise<UserDocument> {
    return this.userModel.findOne(predicate).lean();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async checkPassword(
    reqPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(reqPassword, password);
  }

  private async createAccessToken(
    user: UserDocument,
    req: Request,
    ip: string,
  ): Promise<string> {
    const payload: JwtPayloadDto = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ip: ip.replace('::ffff:', ''),
      userAgent: req.headers['user-agent'],
    };
    return this.jwtService.signAsync(payload);
  }
}

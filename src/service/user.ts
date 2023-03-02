import bcrypt from "bcrypt";
import { LikeInterface } from "../model/like";
import { UserInterface, SortType } from "../model/user";
import { UserRepoInterface } from "../repo/user";

export interface UserServiceInterface {
  create(
    user: UserInterface
  ): Promise<{ user: UserInterface | null; errMessage: string }>;
  update(
    userId: string,
    user: UserInterface
  ): Promise<{ user: UserInterface | null; errMessage: string }>;
  getLike(
    userId: string,
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<LikeInterface[]>;
  count(userId: string): Promise<number>;
}

export class UserService implements UserServiceInterface {
  constructor(public userRepo: UserRepoInterface) {
    this.userRepo = userRepo;
  }

  public async create(
    user: UserInterface
  ): Promise<{ user: UserInterface | null; errMessage: string }> {
    const checkUser = await this.userRepo.getByEmail(user.email);
    if (checkUser) {
      return { user: null, errMessage: "This User is already exist" };
    }
    const password = await this.hashPassword(user.password);
    return {
      user: await this.userRepo.create({ ...user, password }),
      errMessage: "",
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async update(
    userId: string,
    user: UserInterface
  ): Promise<{ user: UserInterface | null; errMessage: string }> {
    const checkUser = await this.userRepo.getById(userId);
    if (!checkUser) {
      return { user: null, errMessage: "Invalid userId" };
    }
    return { user: await this.userRepo.update(userId, user), errMessage: "" };
  }

  public async getLike(
    userId: string,
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<LikeInterface[]> {
    return this.userRepo.getLike(userId, skip, limit, sort);
  }

  public async count(userId: string): Promise<number> {
    return this.userRepo.count(userId);
  }
}

export const newUserService = async (userRepo: UserRepoInterface) => {
  return new UserService(userRepo);
};

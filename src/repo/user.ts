import { LikeModel, LikeInterface } from "./../model/like";
import { UserInterface, UserModel, SortType } from "../model/user";

export interface UserRepoInterface {
  create(user: UserInterface): Promise<UserInterface>;
  update(userId: string, user: UserInterface): Promise<UserInterface | null>;
  getById(userId: string): Promise<UserInterface | null>;
  getByEmail(email: string): Promise<UserInterface | null>;
  getLike(
    userId: string,
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<LikeInterface[]>;
  count(userId: string): Promise<number>;
}

export class UserRepo implements UserRepoInterface {
  constructor(
    public userModel: typeof UserModel,
    public likeModel: typeof LikeModel
  ) {
    this.userModel = userModel;
    this.likeModel = likeModel;
  }

  public async create(user: UserInterface): Promise<UserInterface> {
    return this.userModel.create(user);
  }

  public async update(
    userId: string,
    user: UserInterface
  ): Promise<UserInterface | null> {
    return this.userModel.findOneAndUpdate({ _id: userId }, user, {
      new: true,
    });
  }

  public async getById(userId: string): Promise<UserInterface | null> {
    return this.userModel.findById({ _id: userId });
  }

  public async getByEmail(email: string): Promise<UserInterface | null> {
    return this.userModel.findOne({ email });
  }

  public async getLike(
    userId: string,
    skip: number,
    limit: number,
    sort: SortType
  ): Promise<LikeInterface[]> {
    return this.likeModel
      .find(
        { userId },
        {},
        { skip, limit, sort: { createdAt: sort === SortType.ASC ? 1 : -1 } }
      )
      .populate("article", ["title", "subTitle"]);
  }

  public async count(userId: string): Promise<number> {
    return this.likeModel.count({ userId });
  }
}

export const newUserRepo = async (
  userModel: typeof UserModel,
  likeModel: typeof LikeModel
): Promise<UserRepoInterface> => {
  return new UserRepo(userModel, likeModel);
};

export default UserRepo;

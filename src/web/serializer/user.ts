import { UserInterface } from "../../model/user";
import { LikeInterface } from "../../model/like";

export class UserSerializer {
  public static async serializeUser(user: UserInterface) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    };
  }

  public static async serializeLikes(userLikes: LikeInterface[]) {
    return userLikes.map((userLike) => {
      return {
        id: userLike.id,
        islike: userLike.isLike,
        article: userLike.article,
      };
    });
  }
}

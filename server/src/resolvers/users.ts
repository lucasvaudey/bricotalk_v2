import argon2 from "argon2";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { Users } from "../entities/Users";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  email: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Users, { nullable: true })
  user?: Users;
}

@Resolver()
export class UsersResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const userIdInt = parseInt(userId);
    const user = await Users.findOne(userIdInt);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(newPassword);
    Users.update({ id: userIdInt }, { password: hashedPassword });

    //Log user after reset
    req.session.userId = user.id;

    await redis.del(key);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") _email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await Users.findOne({ email: _email });
    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); //3 jour
    await sendEmail(
      _email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  @Query(() => Users, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      //not Login
      return null;
    }
    return await Users.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req }: MyContext,
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const usertest = await Users.findOne({ username: options.username });
    const emailtest = await Users.findOne({ email: options.email });
    const errors = await validateRegister(options, usertest, emailtest);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = await Users.create({
      username: options.username,
      password: hashedPassword,
      email: options.email,
    }).save();
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { req }: MyContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ) {
    const user = await Users.findOne(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail.toLowerCase() }
    );
    if (user === undefined) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Cet utilisateur n'existe pas",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Mot de passe incorrect",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

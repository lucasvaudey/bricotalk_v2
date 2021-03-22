import { Users } from "../entities/Users";
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
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
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
  // @Mutation(() => Boolean)
  // forgotPassword(@Arg("email") email: string, @Ctx() { em }: MyContext) {}

  @Query(() => Users, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      //not Login
      return null;
    }
    const user = await em.findOne(Users, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em, req }: MyContext,
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const usertest = await em.findOne(Users, { username: options.username });
    const emailtest = await em.findOne(Users, { email: options.email });
    const errors = await validateRegister(options, usertest, emailtest);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(Users, {
      username: options.username,
      password: hashedPassword,
      email: options.email,
    });
    await em.persistAndFlush(user);
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req }: MyContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ) {
    const user = await em.findOne(
      Users,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail.toLowerCase() }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username/email doesn't exit",
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
            message: "incorrect password",
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

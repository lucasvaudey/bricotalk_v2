import { Post } from "../entities/Post";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string,
    @Ctx() {}: MyContext
  ) {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("desc") desc: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ title, desc, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("title", () => String, { nullable: true }) _title: string,
    @Arg("desc", () => String, { nullable: true }) _desc: string,
    @Arg("id") _id: number
  ): Promise<Post | undefined | null> {
    const post = await Post.findOne(_id);
    if (!post) {
      return null;
    }
    if (typeof _title !== "undefined") {
      Post.update({ id: _id }, { title: _title });
    }
    if (typeof _desc !== "undefined") {
      Post.update({ id: _id }, { desc: _desc });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    try {
      await Post.delete(id);
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}

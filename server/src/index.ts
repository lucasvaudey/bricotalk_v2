import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  //seems to not working properly
  //we need to generate our migrator and upping only through CLI
  //or using code to create a migrations each time we run the server
  // const post = orm.em.create(Post, {
  //   title: "my third post",
  //   desc: "hello this is the desc",
  // });
  // await orm.em.persist(post).flush();
  const posts = await orm.em.find(Post, {});
  console.log(posts);
};
main().catch((err) => {
  console.log("The error is :" + err);
});

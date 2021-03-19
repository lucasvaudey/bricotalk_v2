import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UsersResolver } from "./resolvers/users";
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  //seems to not working properly
  //we need to generate our migrator and upping only through CLI
  //or using code to create a migrations each time we run the server
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      //TODO: 1:09:30
      resolvers: [HelloResolver, PostResolver, UsersResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};
main().catch((err) => {
  console.log("The error is :" + err);
});

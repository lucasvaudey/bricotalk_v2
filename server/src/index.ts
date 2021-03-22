import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UsersResolver } from "./resolvers/users";
import connectRedis from "connect-redis";
import session from "express-session";
import redis from "redis";
import cors from "cors";

const main = async () => {
  // sendEmail("bob@bob.com", "hello there");
  const orm = await MikroORM.init(microConfig);
  //Les migrations créer à travers le CLI doivent obligatoirement être up grace au CLI
  //Le migrator up est seulement la pour push les migrations sur la base de donnés
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 365 * 24 * 60 * 60 * 10, //10 an
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__,
      },
      //TODO: change to env variable
      secret: "djkfhjskadhfjksfjkad",
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UsersResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false, //mis sur faux car l'app utilise déjà cors sur une config défini plus haut
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log("The error is :" + err);
});

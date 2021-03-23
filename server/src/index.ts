import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UsersResolver } from "./resolvers/users";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import cors from "cors";
import { createConnection } from "typeorm";
import { Users } from "./entities/Users";
import { Post } from "./entities/Post";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "bricotalk",
    username: "lucas",
    logging: true,
    synchronize: true, //auto-migration
    entities: [Users, Post],
  });
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
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
        client: redis,
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
    context: ({ req, res }) => ({ req, res, redis }),
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

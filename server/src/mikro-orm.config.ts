import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
import { Users } from "./entities/Users";

export default {
  migrations: {
    path: path.join(__dirname, "./migration"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: [Post, Users],
  dbName: "bricotalk",
  user: "lucas",
  debug: !__prod__,
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];

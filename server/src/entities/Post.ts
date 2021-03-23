import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "./Users";
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @ManyToOne(() => Users, (user) => user.posts)
  creator: Users;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ type: "text" })
  title!: string;

  @Field(() => String)
  @Column({ type: "text" })
  desc!: string;

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  like!: number;
}

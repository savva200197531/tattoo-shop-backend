import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { User } from "@/api/user/entities/user.entity";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  count: number;

  @Column()
  product_id: number;

  @ManyToOne(() => User, (user) => user.cart)
  user: User;
}

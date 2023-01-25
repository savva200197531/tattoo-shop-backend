import {
  BaseEntity,
  Column,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { User } from "@/api/user/entities/user.entity";
import { Product } from "@/api/products/entities/product.entity";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public count: number;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn()
  public user: User;

  @Column()
  public price: number

  @ManyToOne(() => Product, (product) => product.cart)
  @JoinColumn()
  public product: Product;
}

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/api/user/entities/user.entity";
import { Product } from "@/api/products/entities/product.entity";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  count: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => User, (user) => user.cart)
  user: User;
}

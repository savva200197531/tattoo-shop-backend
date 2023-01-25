import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "@/api/cart/entities/cart.entity";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public price!: number;

  @Column()
  public count!: number;

  @OneToMany(() => Cart, (cart) => cart.product)
  public cart: Cart[]
}

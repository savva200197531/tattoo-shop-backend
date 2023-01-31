import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "@/api/cart/entities/cart.entity";
import { Favorite } from "@/api/favorite/entities/favorite.entity";

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

  @OneToMany(
    () => Cart,
    (cart) => cart.product
  )
  public cart?: Cart[];

  @OneToMany(
    () => Favorite,
    (cart) => cart.product
  )
  public favorite?: Favorite[]
}

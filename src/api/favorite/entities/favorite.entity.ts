import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/api/user/entities/user.entity";
import { Product } from "@/api/products/entities/product.entity";

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.favorite)
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Product, (product) => product.favorite)
  @JoinColumn()
  public product: Product;
}

import { JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { User } from "@/api/user/entities/user.entity";

export class Cart {
  @PrimaryGeneratedColumn()
  public id!: number;

  // @ManyToOne(() => User, (user) => user.id)
  // userId: User['id'];

  // @OneToOne(() => Product)
  // @JoinColumn()
  public product: Product;
}

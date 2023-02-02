import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "@/api/products/entities/product.entity";

@Entity()
export class ProductImg extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public filename: number;

  @Column({ type: 'bytea' })
  public data!: Uint8Array;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
  )
  @JoinColumn()
  public product: Product;
}

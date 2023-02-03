import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '@/api/products/entities/product.entity';
import LocalFile from '@/api/files/entities/local-file.entity';

@Entity()
export class LocalProductImg extends LocalFile {
  @ManyToOne(() => Product, (product) => product.images, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public product: Product;
}

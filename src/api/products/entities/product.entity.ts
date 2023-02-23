import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from '@/api/cart/entities/cart.entity';
import { Favorite } from '@/api/favorite/entities/favorite.entity';
import LocalFile from '@/api/files/entities/local-file.entity';

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

  @Column()
  public category_id!: number;

  @Column()
  public brand_id!: number;

  @OneToMany(() => Cart, (cart) => cart.product)
  public cart?: Cart[];

  @OneToMany(() => Favorite, (cart) => cart.product)
  public favorite?: Favorite[];

  @JoinColumn({ name: 'img_ids' })
  @OneToMany(() => LocalFile, (img) => img.id)
  public images?: LocalFile[];

  @Column('int', { array: true, nullable: true })
  img_ids?: number[];
}

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '@/api/products/entities/product.entity';
import { User } from '@/api/user/entities/user.entity';
import { IPaymentMethodType } from '@a2seven/yoo-checkout/build/types';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public price: number;

  @Column()
  public phone: number;

  @Column()
  public payment_method: IPaymentMethodType;

  @Column()
  public address: number;

  @ManyToOne(() => User, (user) => user.orders, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  public products: Product[];
}

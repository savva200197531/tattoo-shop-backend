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
import { User } from '@/api/user/entities/user.entity';
import { IPaymentMethodType } from '@a2seven/yoo-checkout/build/types';
import { OrderProduct } from '@/api/orders/entities/order-product.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public price: number;

  @Column()
  public phone: string;

  @Column()
  public payment_method: IPaymentMethodType;

  @Column()
  public address: string;

  @Column()
  public surname: string;

  @Column()
  public name: string;

  @Column()
  public lastname: string;

  @Column()
  public email: string;

  @Column()
  public region: string;

  @Column()
  public city: string;

  @Column()
  public comment: string;

  @Column()
  public status: string;

  @ManyToOne(() => User, (user) => user.orders, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToMany(() => OrderProduct)
  @JoinTable()
  public products: OrderProduct[];
}

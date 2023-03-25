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
import { OrderProduct } from '@/api/orders/entities/order-product.entity';
import { OrderStatus } from '@/api/orders/types/orderStatus';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  // user

  @Column()
  public phone: string;

  @Column()
  public surname: string;

  @Column()
  public name: string;

  @Column()
  public lastname: string;

  @Column()
  public email: string;

  // address

  @Column()
  public region: string;

  @Column()
  public city: string;

  @Column()
  public street: string;

  @Column()
  public house: string;

  @Column()
  public apartment: string;

  @Column({ nullable: true, default: null })
  public comment: string;

  // rest

  @Column()
  public price: number;

  @Column()
  public status: OrderStatus;

  @Column({ type: 'timestamp' })
  public date: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public user?: User;

  @ManyToMany(() => OrderProduct)
  @JoinTable()
  public products: OrderProduct[];
}

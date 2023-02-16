import { Entity } from 'typeorm';
import { Product } from '@/api/products/entities/product.entity';

@Entity()
export class OrderProduct extends Product {}

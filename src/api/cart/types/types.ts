import { Cart } from '@/api/cart/entities/cart.entity';

export type CartResponse = {
  totalPrice: number;
  totalProductsCount: number;
  items: Cart[];
};

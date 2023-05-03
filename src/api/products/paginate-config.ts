import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from '@/api/products/entities/product.entity';

export const paginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['id', 'price', 'created_at'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name'],
  defaultLimit: 16,
  filterableColumns: {
    category_id: [FilterOperator.EQ, FilterOperator.IN],
    brand_id: [FilterOperator.EQ, FilterOperator.IN],
    price: [FilterOperator.BTW],
  },
  relations: [],
  withDeleted: false,
  relativePath: true,
  origin: 'http://localhost:3000',
};

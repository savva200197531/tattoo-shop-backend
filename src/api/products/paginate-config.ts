import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from '@/api/products/entities/product.entity';

export const paginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['id', 'name'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name'],
  maxLimit: 10,
  defaultLimit: 10,
  filterableColumns: { category_id: [FilterOperator.EQ, FilterOperator.IN] },
  relations: [],
  withDeleted: false,
  relativePath: true,
  origin: 'http://cats.example',
};

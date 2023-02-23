import { Column, Entity } from 'typeorm';
import { BaseFilterEntity } from '@/api/products-filters/entities/base-filter.entity';

@Entity()
export class Brand extends BaseFilterEntity {
  @Column('int', { array: true, nullable: true })
  category_ids?: number[];
}

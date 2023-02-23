import { Column, Entity } from 'typeorm';
import { BaseFilterEntity } from '@/api/products-filters/entities/base-filter.entity';

@Entity()
export class Type extends BaseFilterEntity {
  @Column()
  public category_id!: number;
}

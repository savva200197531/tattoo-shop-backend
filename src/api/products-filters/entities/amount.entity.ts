import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseFilterEntity } from '@/api/products-filters/entities/base-filter.entity';
import { Category } from '@/api/products-filters/entities/category.entity';

@Entity()
export class Amount extends BaseFilterEntity {
  @JoinColumn({ name: 'category_ids' })
  @OneToMany(() => Category, (category) => category.id)
  public categories?: Category[];

  @Column('int', { array: true, nullable: true })
  category_ids?: number[];
}

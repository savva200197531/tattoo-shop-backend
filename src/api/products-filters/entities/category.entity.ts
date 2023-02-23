import { Entity } from 'typeorm';
import { BaseFilterEntity } from '@/api/products-filters/entities/base-filter.entity';

@Entity()
export class Category extends BaseFilterEntity {}

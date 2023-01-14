import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public price!: number;

  @Column()
  public count!: number;
}

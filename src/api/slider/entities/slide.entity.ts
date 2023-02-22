import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LocalFile from '@/api/files/entities/local-file.entity';

@Entity()
export class Slide extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public link: string;

  @JoinColumn({ name: 'img_id' })
  @OneToOne(() => LocalFile, {
    onDelete: 'CASCADE',
  })
  public img?: LocalFile;

  @Column('int', { nullable: true })
  img_id?: number;
}

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
  public title: string;

  @Column()
  public description: string;

  @Column()
  public bg_color: string;

  @JoinColumn({ name: 'img_id' })
  @OneToOne(() => LocalFile)
  public img?: LocalFile;

  @Column('int', { nullable: true })
  img_id?: number;
}

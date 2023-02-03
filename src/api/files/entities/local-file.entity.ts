import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class LocalFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default LocalFile;

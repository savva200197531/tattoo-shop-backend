import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "@/api/cart/entities/cart.entity";
import { Favorite } from "@/api/favorite/entities/favorite.entity";
import Role from "@/api/user/role.enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', unique: true })
  public email!: string;

  @Column({ default: false })
  public isEmailConfirmed!: boolean;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @OneToMany(() => Cart, cart => cart.user)
  public cart: Cart[]

  @OneToMany(() => Favorite, favorite => favorite.user)
  public favorite: Favorite[]

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role
}

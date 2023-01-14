
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { Cart } from "@/api/cart/entities/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

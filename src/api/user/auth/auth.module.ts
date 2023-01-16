import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { EmailConfirmationModule } from "@/api/user/email-confirmation/email-confirmation.module";
import { JwtAuthGuard } from "@/api/user/auth/auth.guard";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    EmailConfirmationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy],
  exports: []
})
export class AuthModule {}

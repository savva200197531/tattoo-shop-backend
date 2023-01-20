import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationModule } from "@/api/email-confirmation/email-confirmation.module";

import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { UserModule } from "@/api/user/user.module";

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
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy],
})
export class AuthModule {}

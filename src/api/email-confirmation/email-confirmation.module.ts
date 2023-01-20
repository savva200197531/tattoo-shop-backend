import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailModule } from "@/api/email/email.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "@/api/user/user.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_VERIFICATION_TOKEN_SECRET'),
        signOptions: { expiresIn: config.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME') },
      }),
    }),
    EmailModule,
    UserModule
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}

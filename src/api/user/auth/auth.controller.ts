import { Request } from 'express';

import { Body, Controller, Inject, Post, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { User } from '@/api/user/entities/user.entity';
import { AuthGuard } from "@nestjs/passport";

import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { EmailConfirmationService } from "@/api/user/email-confirmation/email-confirmation.service";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly service: AuthService,
    @Inject(EmailConfirmationService) private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private async register(@Body() body: RegisterDto): Promise<User | never> {
    const user = await this.service.register(body);
    await this.emailConfirmationService.sendVerificationLink(body.email)
    return user
  }

  @Post('login')
  private login(@Body() body: LoginDto): Promise<string | never> {
    return this.service.login(body);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  private refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<User>user);
  }
}

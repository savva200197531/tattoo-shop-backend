import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req
} from "@nestjs/common";
import { User } from '@/api/user/entities/user.entity';
import { EmailConfirmationService } from "@/api/email-confirmation/email-confirmation.service";
import { JwtAuthGuard } from "@/api/auth/auth.guard";

import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import RequestWithUser from "@/api/auth/types/requestWithUser.inteface";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(EmailConfirmationService) private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private async register(@Body() body: RegisterDto): Promise<User | never> {
    const user = await this.authService.register(body);
    await this.emailConfirmationService.sendVerificationLink(body.email)
    return user
  }

  @Post('login')
  // @UseGuards(EmailConfirmationGuard)
  private login(@Body() body: LoginDto): Promise<string | never> {
    return this.authService.login(body);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: RequestWithUser): Promise<string | never> {
    return this.authService.refresh(user);
  }
}

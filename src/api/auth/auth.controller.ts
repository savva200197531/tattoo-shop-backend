import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Get,
  Headers,
} from "@nestjs/common";
import { User } from '@/api/user/entities/user.entity';
import { AuthGuard } from "@nestjs/passport";
import { EmailConfirmationService } from "@/api/email-confirmation/email-confirmation.service";
import { JwtAuthGuard } from "@/api/auth/auth.guard";
import getJwtFromHeaderHelper from "@/common/helper/getJwtFromHeader.helper";

import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

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
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  private refresh(@Headers() headers): Promise<string> {
    return this.authService.refresh(getJwtFromHeaderHelper(headers));
  }

  // @Post('refresh')
  // @UseGuards(AuthGuard('jwt'))
  // private refresh(@Req() { user }: RequestWithUser): Promise<string | never> {
  //   return this.authService.refresh(user);
  // }

  @Get('get-user-by-jwt')
  @UseGuards(JwtAuthGuard)
  private getUserByJwt(@Headers() headers): Promise<User> {
    return this.authService.getUserByJwt(getJwtFromHeaderHelper(headers))
  }
}

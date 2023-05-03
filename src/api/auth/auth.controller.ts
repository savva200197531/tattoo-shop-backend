import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User } from '@/api/user/entities/user.entity';
import { EmailConfirmationService } from '@/api/email-confirmation/email-confirmation.service';
import RequestWithUser from '@/api/auth/types/requestWithUser.inteface';
import { JwtAuthGuard } from '@/api/auth/auth.guard';

import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

// const redisClient = new Redis({ enableOfflineQueue: false });
//
// const maxWrongAttemptsByIPperDay = 100;
// const maxConsecutiveFailsByUsernameAndIP = 5;
//
// const limiterSlowBruteByIP = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: 'login_fail_ip_per_day',
//   points: maxWrongAttemptsByIPperDay,
//   duration: 60 * 60 * 24,
//   blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
// });
//
// const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: 'login_fail_consecutive_username_and_ip',
//   points: maxConsecutiveFailsByUsernameAndIP,
//   duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
//   blockDuration: 60 * 60, // Block for 1 hour
// });

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(EmailConfirmationService)
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private async register(@Body() body: RegisterDto): Promise<User | never> {
    const user = await this.authService.register(body);
    await this.emailConfirmationService.sendVerificationLink(body.email);
    return user;
  }

  @Post('login')
  private async login(@Body() body: LoginDto): Promise<string | never> {
    // const usernameIPkey = this.authService.getUsernameIPkey(body.email, req.ip);
    //
    // const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    //   limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    //   limiterSlowBruteByIP.get(req.ip),
    // ]);
    //
    // let retrySecs = 0;
    //
    // // Check if IP or Username + IP is already blocked
    // if (
    //   resSlowByIP !== null &&
    //   resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
    // ) {
    //   retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    // } else if (
    //   resUsernameAndIP !== null &&
    //   resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
    // ) {
    //   retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    // }
    //
    // if (retrySecs > 0) {
    //   res.set('Retry-After', String(retrySecs));
    //   res.status(429).send('Too Many Requests');
    // }

    return this.authService.login(body);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: RequestWithUser): Promise<string | never> {
    return this.authService.refresh(user);
  }
}

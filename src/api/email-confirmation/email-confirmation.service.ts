import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "@/api/email/email.service";
import { UserService } from "@/api/user/user.service";
import VerificationTokenPayload from "@/api/email-confirmation/types/verificationTokenPayload.interface";

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    })
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(id: number) {
    const { isEmailConfirmed, email } = await this.userService.findUser(id)

    if (isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.sendVerificationLink(email);
  }
}

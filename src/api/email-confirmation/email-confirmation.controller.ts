import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post, Req, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmEmailDto } from "@/api/email-confirmation/dto/email-confirmation.dto";
import { JwtAuthGuard } from "@/api/auth/auth.guard";
import RequestWithUser from "@/api/auth/types/requestWithUser.inteface";

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() { user }: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(user.id);
  }
}

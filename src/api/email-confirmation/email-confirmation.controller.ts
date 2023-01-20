import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors
} from "@nestjs/common";
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmEmailDto } from "@/api/email-confirmation/dto/email-confirmation.dto";

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link/:id')
  async resendConfirmationLink(@Param('id', ParseIntPipe) id: number) {
    await this.emailConfirmationService.resendConfirmationLink(id);
  }
}

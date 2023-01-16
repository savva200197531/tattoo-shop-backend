import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from "@nestjs/common";
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmEmailDto } from "@/api/user/email-confirmation/dto/email-confirmation.dto";

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  // @Post('confirm')
  // async confirm(@Body() confirmationData: ConfirmEmailDto) {
  //   const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
  //   await this.emailConfirmationService.confirmEmail(email);
  // }
}

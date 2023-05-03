import { Inject, Injectable } from '@nestjs/common';
import { EmailService } from '@/api/email/email.service';
import { SendFeedbackDto } from '@/api/feedback/dto/send-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(EmailService) private emailService: EmailService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  public sendFeedback(params: SendFeedbackDto) {
    return this.emailService.sendMail({
      to: this.configService.get('EMAIL_USER'),
      subject: `Вопрос по сайту от ${new Date()}`,
      text: `
        Телефон: ${params.phone}
        Имя: ${params.name}
        Комментарий: ${params.comment}
      `,
    });
  }
}

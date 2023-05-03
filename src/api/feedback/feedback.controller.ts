import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { SendFeedbackDto } from '@/api/feedback/dto/send-email.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async sendFeedback(@Body() body: SendFeedbackDto) {
    return this.feedbackService.sendFeedback(body);
  }
}

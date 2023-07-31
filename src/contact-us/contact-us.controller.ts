import { Controller, Post, Body } from '@nestjs/common';

import { ContactUsService } from './contact-us.service';
import { ContactUsDto } from './dto/contact-us.dto';

@Controller('contactUs')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post('send-email')
  sendEmail(@Body() body: ContactUsDto) {
    return this.contactUsService.sendEmail(body);
  }
}

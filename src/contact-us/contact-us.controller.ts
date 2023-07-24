import { Controller, Post, Body } from '@nestjs/common';

import { ContactUsService } from './contact-us.service';

@Controller('contactUs')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post('send-email')
  sendEmail(@Body() body: { email: string; subject: string; about: string }) {
    return this.contactUsService.sendEmail(body);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';

import { MailerService } from '../nodemailer/mailer.service';
import { ContactUsModuleMessages } from '../utils/appMessges';

@Injectable()
export class ContactUsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(body: { email: string; subject: string; about: string }): Promise<string> {
    const { email, subject, about } = body;
    try {
      await this.mailerService.sendMail(email, subject, about);
      return ContactUsModuleMessages.SuccessfullySentEmailMessage;
    } catch (error) {
      throw new BadRequestException(ContactUsModuleMessages.BadRequestExceptionEmailNotSent);
    }
  }
}

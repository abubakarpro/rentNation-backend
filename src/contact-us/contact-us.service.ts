import { Injectable, BadRequestException } from '@nestjs/common';

import { MailerService } from '../nodemailer/mailer.service';
import { ContactUsModuleMessages } from '../utils/appMessges';
import { ContactUsDto } from './dto/contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(body: ContactUsDto): Promise<string> {
    const { name, email, subject, about } = body;
    try {
      await this.mailerService.sendMail(email, subject, about, name);
      return ContactUsModuleMessages.SuccessfullySentEmailMessage;
    } catch (error) {
      throw new BadRequestException(ContactUsModuleMessages.BadRequestExceptionEmailNotSent);
    }
  }
}

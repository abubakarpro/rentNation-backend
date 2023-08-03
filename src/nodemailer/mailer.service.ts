import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(to: string, subject: string = '', text: string, name: string = ''): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    const adminOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: to,
      subject: subject,
      text: text,
    };

    await Promise.all([transporter.sendMail(adminOptions)]);
  }
}

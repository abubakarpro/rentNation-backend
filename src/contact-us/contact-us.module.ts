import { Module } from '@nestjs/common';

import { MailerModule } from '../nodemailer/mailer.module';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';

@Module({
  imports: [MailerModule],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}

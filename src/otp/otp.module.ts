import { Module } from '@nestjs/common';

import { MailerModule } from '../nodemailer/mailer.module';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, MailerModule, UsersModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}

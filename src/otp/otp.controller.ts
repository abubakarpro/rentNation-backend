import { Controller, Post, Body } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOtp(@Body('email') email: string) {
    return await this.otpService.generateAndSendOtp(email);
  }

  @Post('verify')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return await this.otpService.verifyOtp(email, otp);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.otpService.cleanupExpiredOtps();
  }
}

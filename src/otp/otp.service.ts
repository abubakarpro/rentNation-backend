import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';

import { Otp, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { MailerService } from '../nodemailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { OTPServiceMessages } from 'src/utils/appMessges';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  private generateOtp(): string {
    const min = 1000;
    const max = 9999;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  private async hashOtp(otp: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    console.log('salt', salt);
    const hashedOtp: string = await bcrypt.hash(otp, salt);
    return hashedOtp;
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      await this.mailerService.sendMail(email, OTPServiceMessages.OTPSendingMailSubject, otp);
    } catch (error) {
      throw new BadRequestException(OTPServiceMessages.BadRequestExceptionSendingOTPFailed);
    }
  }

  async generateAndSendOtp(email: string): Promise<{ message: string }> {
    try {
      await this.userService.validateUser(email);
      const otp = this.generateOtp();
      const hashedOtp = await this.hashOtp(otp);

      await this.prisma.otp.create({
        data: {
          email,
          hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
        },
      });

      await this.sendOtpEmail(email, `Your OTP is: ${otp}`);
      return { message: OTPServiceMessages.OTPSentSuccessfully };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //Verify Otp Flow
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    try {
      const otpEntry = await this.prisma.otp.findFirst({
        where: { email: email },
        orderBy: [{ expiresAt: 'desc' }],
      });

      if (!otpEntry) {
        throw new BadRequestException('OTP not found.');
      }

      const isOtpValid = await bcrypt.compare(otp, otpEntry.hashedOtp);

      if (!isOtpValid) {
        throw new BadRequestException(OTPServiceMessages.OTPInvalid);
      }

      const currentTime = new Date();
      if (currentTime > otpEntry.expiresAt) {
        throw new BadRequestException(OTPServiceMessages.OTPExpired);
      }

      if (otpEntry.isUsed) {
        throw new BadRequestException(OTPServiceMessages.OTPAlreadyUsed);
      }

      await this.prisma.otp.update({
        where: { id: otpEntry.id },
        data: { isUsed: true },
      });

      return { message: OTPServiceMessages.OTPValid };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    const currentTime = new Date();
    await this.prisma.otp.deleteMany({
      where: { expiresAt: { lt: currentTime } },
    });
  }
}

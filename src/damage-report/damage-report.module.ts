import { Module } from '@nestjs/common';
import { DamageReportService } from './damage-report.service';
import { DamageReportController } from './damage-report.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DamageReportController],
  providers: [DamageReportService],
})
export class DamageReportModule {}

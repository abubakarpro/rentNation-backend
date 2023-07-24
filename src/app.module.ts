import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { DamageReportModule } from './damage-report/damage-report.module';
import { TicketModule } from './ticket/ticket.module';
import { OrderModule } from './order/order.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';
import { ContactUsModule } from './contact-us/contact-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
    DamageReportModule,
    TicketModule,
    OrderModule,
    ProfileModule,
    NotificationModule,
    ContactUsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}

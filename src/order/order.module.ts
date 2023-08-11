import { Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from 'src/product/product.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionModule } from '../transaction/transaction.module';
import { StripeModule } from 'src/payment-gateway/stripe/stripe.module';
import { StripeService } from 'src/payment-gateway/stripe/stripe.service';

@Module({
  imports: [PrismaModule, ProductModule, TransactionModule, StripeModule],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}

import { Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from 'src/product/product.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersModule } from '../users/users.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[PrismaModule, UsersModule, ProductModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}

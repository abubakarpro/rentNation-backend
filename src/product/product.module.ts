import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports:[PrismaModule, UsersModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ ProductService],
})
export class ProductModule {}

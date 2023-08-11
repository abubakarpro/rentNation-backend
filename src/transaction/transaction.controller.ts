import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RolesGuard } from '../users/auth/roles.guard';
import { Role } from '../users/dto/role.enum';
import { ApiResponseTags } from 'src/utils/decorators/api-response-tags-decorator';

@Controller('transaction')
@ApiTags('Transaction Module')
@ApiResponseTags()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Post()
  createTranscation(@Body() createTranscationDto: CreateTransactionDto) {
    return this.transactionService.createTranscation(createTranscationDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Get()
  findAllTransactions() {
    return this.transactionService.findAllTransactions({});
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneTransaction(@Param('id') id: string) {
    return this.transactionService.findOneTransaction(id);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateTransaction(@Param('id') id: string, @Body() updateTransactionDto: CreateTransactionDto) {
    return this.transactionService.updateTransaction(id, updateTransactionDto);
  }

  @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeTransaction(@Param('id') id: string) {
    return this.transactionService.removeTransaction(id);
  }
}

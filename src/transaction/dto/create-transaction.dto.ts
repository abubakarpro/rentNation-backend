import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paymentId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paymentStatus: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

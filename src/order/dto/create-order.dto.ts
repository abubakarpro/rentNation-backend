import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  productData: JSON;

  @ApiProperty()
  @IsNotEmpty()
  subTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty()
  @IsOptional()
  payment_method_id: string;
}

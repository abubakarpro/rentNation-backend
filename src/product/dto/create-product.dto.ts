import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class locationDto {
  @ApiProperty()
  @IsNotEmpty()
  placeId: string

  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  city: string

}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  availableFrom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  availableTo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsArray()
  images: string[];

  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  pricePerDay: number;

  @ApiProperty()
  @IsNotEmpty()
  discountPerWeek: number;

  @ApiProperty()
  @IsOptional()
  properties: JSON;

  @ApiProperty()
  @IsNotEmpty()
  location: locationDto

}



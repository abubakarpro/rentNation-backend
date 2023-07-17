import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export enum Categories {
  VEHICLES = 'VEHICLES',
  BEACHES = 'BEACHES',
  KAYAKS = "KAYAKS",
  GOLF_CARTS = "GOLF_CARTS",
  OTHERS = "OTHERS"
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Categories)
  name: Categories;
}

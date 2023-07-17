import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateProductView {
  @ApiProperty()
  @IsNotEmpty()
  viewCounter: number;
}



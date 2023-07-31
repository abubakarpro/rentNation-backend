import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactUsDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsOptional()
  subject: string;

  @ApiProperty()
  @IsOptional()
  about: string;
}

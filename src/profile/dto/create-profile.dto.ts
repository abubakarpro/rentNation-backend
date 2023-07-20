import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  serviceUpdate: boolean;

  @ApiProperty()
  @IsOptional()
  sound: boolean;

  @ApiProperty()
  @IsOptional()
  notification: boolean;
}

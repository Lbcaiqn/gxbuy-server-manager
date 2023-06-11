import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '12345678' })
  shopAccount: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '123456' })
  shopPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '12345678' })
  userAccount: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '123456' })
  userPassword: string;
}

import { IsNotEmpty, IsString, IsArray, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class CreateManagerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^.{5,50}$/, { message: '5到50个字符' })
  @ApiProperty({ type: String, example: '12345678' })
  managerAccount: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/, {
    message: '8到30位，至少一个字母，至少一个数字',
  })
  @ApiProperty({ type: String, example: 'qwer1234' })
  managerPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^.{2,30}$/, { message: '2到30个字符' })
  @ApiProperty({ type: String, example: 'lgx' })
  managerName: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: Array<string>,
    example: ['1', '2'],
  })
  roleIds: Array<string>;
}

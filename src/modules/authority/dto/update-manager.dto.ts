import { IsNotEmpty, IsString, IsArray, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UpdateManagerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^.{5,50}$/, { message: '5到50个字符' })
  @ApiProperty({ type: String, example: '12345678' })
  managerAccount: string;

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  managerId: string;
}

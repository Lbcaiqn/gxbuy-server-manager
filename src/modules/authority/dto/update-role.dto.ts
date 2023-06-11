import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UpdateRoleDto extends CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  roleId: string;
}

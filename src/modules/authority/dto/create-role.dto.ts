import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

class BtnDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '按钮权限名' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '按钮权限值' })
  value: string;
}

class RoleAuthorityDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  _id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '菜单路由name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '菜单名' })
  title: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ApiProperty({
    type: Array<RoleAuthorityDto>,
    example: [{ name: '增加角色', value: 'role-add-role' }],
  })
  button?: Array<BtnDto>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ApiProperty({
    type: Array<RoleAuthorityDto>,
  })
  children?: Array<RoleAuthorityDto>;
}

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^.{2,30}$/, { message: '2到30个字符' })
  @ApiProperty({ type: String, example: '角色名' })
  roleName: string;

  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ApiProperty({
    type: Array<RoleAuthorityDto>,
    example: [{ _id: 1, name: 'roleManage', title: '角色管理', button: [], children: {} }],
  })
  authority: Array<RoleAuthorityDto>;
}

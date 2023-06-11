import { Controller, UseGuards, SetMetadata, Get, Post, Patch, Delete, Req, Param, Body } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { AuthGuard } from '@/common/guard/auth-guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ValidatePipe } from '@/common/pipe/validate.pipe';
import { VarifyParamsQuery } from '@/tools/varifyParamsQuery';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller({
  path: 'authority',
  version: '1',
})
@UseGuards(JwtGuard, AuthGuard)
@ApiTags('权限相关接口')
export class AuthorityController {
  constructor(private readonly authorityService: AuthorityService) {}

  @Get('getAuthorityData')
  @ApiOperation({ summary: '获取权限列表', description: '获取权限列表' })
  getAuthorityData() {
    return this.authorityService.getAuthorityData();
  }

  @Get('/jwt/getRoleList')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'roleManage',
    isBtn: false,
  })
  @ApiOperation({
    summary: '获取spu或角色列表',
    description: '获取角色列表',
  })
  @ApiQuery({ name: 'pageSize', type: Number, description: '每页数量', required: true })
  @ApiQuery({ name: 'page', type: Number, description: '页码', required: true })
  getRoleList(@Req() req) {
    if (!VarifyParamsQuery.varifyPage(req.query.pageSize)) req.query.pageSize = 30;
    if (!VarifyParamsQuery.varifyPage(req.query.page)) req.query.page = 1;

    return this.authorityService.getRoleList(req);
  }

  @Post('/jwt/addRole')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'role-add-role',
    isBtn: true,
  })
  @ApiOperation({
    summary: '新增角色',
    description: '新增角色',
  })
  addRole(@Req() req, @Body(ValidatePipe) body: CreateRoleDto) {
    return this.authorityService.addRole(req, body);
  }

  @Patch('/jwt/updateRole')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'role-update-role',
    isBtn: true,
  })
  @ApiOperation({ summary: '修改角色', description: '修改角色' })
  updateRole(@Req() req, @Body(ValidatePipe) body: UpdateRoleDto) {
    return this.authorityService.updateRole(req, body);
  }

  @Delete('/jwt/deleteRole/:id')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'role-delete-role',
    isBtn: true,
  })
  @ApiOperation({ summary: '删除角色', description: '删除角色' })
  @ApiParam({ name: '角色id', type: String, description: '角色id', required: true })
  deleteRole(@Req() req, @Param('id') roleId: string) {
    return this.authorityService.deleteRole(req, roleId);
  }

  // ------------------------------------------------------------------------
  @Get('/jwt/getRoleData')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'userManage',
    isBtn: false,
  })
  @ApiOperation({ summary: '获取角色列表（checkbox）', description: '获取角色列表（checkbox）' })
  getRoleData(@Req() req) {
    return this.authorityService.getRoleData(req);
  }

  @Get('/jwt/getManagerList')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'userManage',
    isBtn: false,
  })
  @ApiOperation({
    summary: '获取spu或管理者列表',
    description: '获取管理者列表',
  })
  @ApiQuery({ name: 'pageSize', type: Number, description: '每页数量', required: true })
  @ApiQuery({ name: 'page', type: Number, description: '页码', required: true })
  getManagerList(@Req() req) {
    if (!VarifyParamsQuery.varifyPage(req.query.pageSize)) req.query.pageSize = 30;
    if (!VarifyParamsQuery.varifyPage(req.query.page)) req.query.page = 1;

    return this.authorityService.getManagerList(req);
  }

  @Post('/jwt/addManager')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'user-add-user',
    isBtn: true,
  })
  @ApiOperation({
    summary: '新增管理者',
    description: '新增管理者',
  })
  addManager(@Req() req, @Body(ValidatePipe) body: CreateManagerDto) {
    return this.authorityService.addManager(req, body);
  }

  @Patch('/jwt/updateManager')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'user-update-user',
    isBtn: true,
  })
  @ApiOperation({ summary: '修改管理者', description: '修改管理者' })
  updateManager(@Req() req, @Body(ValidatePipe) body: UpdateManagerDto) {
    return this.authorityService.updateManager(req, body);
  }

  @Delete('/jwt/deleteManager/:id')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'user-delete-user',
    isBtn: true,
  })
  @ApiOperation({ summary: '删除管理者', description: '删除管理者' })
  @ApiParam({ name: '管理者id', type: String, description: '管理者id', required: true })
  deleteManager(@Req() req, @Param('id') managerId: string) {
    return this.authorityService.deleteManager(req, managerId);
  }
}

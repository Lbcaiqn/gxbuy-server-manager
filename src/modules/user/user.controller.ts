import { Controller, UseGuards, SetMetadata, Get, Post, Req, Body } from '@nestjs/common';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidatePipe } from '@/common/pipe/validate.pipe';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('用户相关接口')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @ApiOperation({ summary: '用户登录', description: '用户登录' })
  login(@Body(ValidatePipe) loginInfo: UserLoginDto) {
    return this.userService.login(loginInfo);
  }

  @Get('/jwt/getUserInfo')
  @SetMetadata('jwt', true)
  @ApiOperation({ summary: '获取用户个人信息', description: '获取用户个人信息' })
  @ApiBearerAuth()
  getUserInfo(@Req() req) {
    return this.userService.getUserInfo(req);
  }
}

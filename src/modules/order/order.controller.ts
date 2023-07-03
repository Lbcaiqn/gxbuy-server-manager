import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { AuthGuard } from '@/common/guard/auth-guard';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller({
  path: 'order',
  version: '1',
})
@UseGuards(JwtGuard, AuthGuard)
@ApiTags('商品相关接口')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/jwt/getSalesData')
  @ApiOperation({ summary: '获取销售数据', description: '获取销售数据' })
  getSalesData(@Req() req) {
    return this.orderService.getSalesData(req);
  }
}

import { Controller, UseGuards, SetMetadata, Get, Post, Patch, Delete, Req, Param, Body } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { AuthGuard } from '@/common/guard/auth-guard';
import { ValidatePipe } from '@/common/pipe/validate.pipe';
import { VarifyParamsQuery } from '@/tools/varifyParamsQuery';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateGoodsSpuDto } from './dto/create-goods-spu.dto';
import { CreateGoodsSkuDto } from './dto/create-goods-sku.dto';
import { UpdateGoodsSpuDto } from './dto/update-goods-spu.dto';
import { UpdateGoodsSkuDto } from './dto/update-goods-sku.dto';
import { GroundGoodsDto } from './dto/ground-goods.dto';

@Controller({
  path: 'goods',
  version: '1',
})
@UseGuards(JwtGuard, AuthGuard)
@ApiTags('商品相关接口')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('getCategoryData')
  @ApiOperation({ summary: '获取分类列表', description: '三级分类信息' })
  getCategoryData() {
    return this.goodsService.getCategoryData();
  }

  @Get('/jwt/getGoodsSpuList')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goodsManage',
    isBtn: false,
  })
  @ApiOperation({
    summary: '获取spu列表',
    description: '获取sku列表',
  })
  @ApiQuery({ name: 'pageSize', type: Number, description: '每页数量', required: true })
  @ApiQuery({ name: 'page', type: Number, description: '页码', required: true })
  getGoodsSpuList(@Req() req) {
    if (!VarifyParamsQuery.varifyPage(req.query.pageSize)) req.query.pageSize = 30;
    if (!VarifyParamsQuery.varifyPage(req.query.page)) req.query.page = 1;

    return this.goodsService.getGoodsSpuList(req);
  }

  @Get('/jwt/getGoodsSkuList')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-view-sku',
    isBtn: true,
  })
  @ApiOperation({
    summary: '获取sku列表',
    description: '获取sku列表',
  })
  @ApiQuery({ name: 'goodsSpuId', type: String, description: 'spu的id', required: true })
  getGoodsSkuList(@Req() req) {
    return this.goodsService.getGoodsSkuList(req);
  }

  @Post('/jwt/createGoodsSpu')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-add-spu',
    isBtn: true,
  })
  @ApiOperation({ summary: '新增SPU', description: '新增SPU' })
  createGoodsSpu(@Req() req, @Body(ValidatePipe) body: CreateGoodsSpuDto) {
    return this.goodsService.createGoodsSpu(req, body);
  }

  @Post('/jwt/createGoodsSku')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-add-sku',
    isBtn: true,
  })
  @ApiOperation({ summary: '新增SKU', description: '新增SKU' })
  createGoodsSku(@Req() req, @Body(ValidatePipe) body: CreateGoodsSkuDto) {
    return this.goodsService.createGoodsSku(req, body);
  }

  @Patch('/jwt/updateGoodsSpu')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-update-spu',
    isBtn: true,
  })
  @ApiOperation({ summary: '修改SPU', description: '修改SPU' })
  updateGoodsSpu(@Req() req, @Body(ValidatePipe) body: UpdateGoodsSpuDto) {
    return this.goodsService.updateGoodsSpu(req, body);
  }

  @Patch('/jwt/updateGoodsSku')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-update-sku',
    isBtn: true,
  })
  @ApiOperation({ summary: '修改SKU', description: '修改SKU' })
  updateGoodsSku(@Req() req, @Body(ValidatePipe) body: UpdateGoodsSkuDto) {
    return this.goodsService.updateGoodsSku(req, body);
  }

  @Delete('/jwt/deleteGoodsSpu/:id')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-delete-spu',
    isBtn: true,
  })
  @ApiOperation({ summary: '删除SPU', description: '删除SPU' })
  @ApiParam({ name: 'spu的id', type: String, description: 'spu的id', required: true })
  deleteGoodsSpu(@Req() req, @Param('id') goodsSpuId: string) {
    return this.goodsService.deleteGoodsSpu(req, goodsSpuId);
  }

  @Delete('/jwt/deleteGoodsSku/:id')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-delete-sku',
    isBtn: true,
  })
  @ApiOperation({ summary: '删除SKU', description: '删除SKU' })
  @ApiParam({ name: 'sku的id', type: String, description: 'sku的id', required: true })
  deleteGoodsSku(@Req() req, @Param('id') goodsSkuId: string) {
    return this.goodsService.deleteGoodsSku(req, goodsSkuId);
  }

  @Patch('/jwt/groundGoods')
  @SetMetadata('jwt', true)
  @SetMetadata('auth', {
    value: 'goods-ground-sku',
    isBtn: true,
  })
  @ApiOperation({ summary: '上下架商品', description: '上下架商品' })
  groundGoods(@Req() req, @Body(ValidatePipe) body: GroundGoodsDto) {
    return this.goodsService.ground(req, body);
  }
}

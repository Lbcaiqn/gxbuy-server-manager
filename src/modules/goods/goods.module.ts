import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsSpu } from './entities/goods_spu.entity';
import { GoodsSku } from './entities/goods_sku.entity';
import { GoodsImg } from './entities/goods_img.entity';
import { Category } from './entities/category.entity';
import { ShopManager } from '../user/entities/shop_manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsSpu, GoodsSku, GoodsImg, Category, ShopManager])],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}

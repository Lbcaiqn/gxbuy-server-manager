import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderInformation } from './entities/order_information.entity';
import { OrderItem } from './entities/order_item.entity';
import { ShopManager } from '../user/entities/shop_manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderInformation, OrderItem, ShopManager])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

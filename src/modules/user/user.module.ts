import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopManager } from './entities/shop_manager.entity';
import { ShopManagerRole } from './entities/shop_manager_role.entity';
import { ShopManagerSystemAuthority } from './entities/shop_manager_system_authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, ShopManager, ShopManagerRole, ShopManagerSystemAuthority])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopManager } from '../user/entities/shop_manager.entity';
import { ShopManagerRole } from '../user/entities/shop_manager_role.entity';
import { ShopManagerSystemAuthority } from '../user/entities/shop_manager_system_authority.entity';
import { Type } from 'class-transformer';

@Module({
  imports: [TypeOrmModule.forFeature([ShopManager, ShopManagerRole, ShopManagerSystemAuthority])],
  controllers: [AuthorityController],
  providers: [AuthorityService],
})
export class AuthorityModule {}

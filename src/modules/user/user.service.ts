import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { ShopManager } from './entities/shop_manager.entity';
import { ShopManagerRole } from './entities/shop_manager_role.entity';
import { ShopManagerSystemAuthority } from './entities/shop_manager_system_authority.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { sign, verify } from 'jsonwebtoken';
import { SECRCT } from '@/common/secrct';
import * as bcrypt from 'bcryptjs';
import { deepCopy } from '@/tools/deepCopy';
import { getAuthority, arrayObjectToObject, objectToArrayObject } from '@/tools/authority';
import { merge } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(ShopManager) private readonly shopManagerRepository: Repository<ShopManager>,
    @InjectRepository(ShopManagerRole) private readonly shopManagerRoleRepository: Repository<ShopManagerRole>,
    @InjectRepository(ShopManagerSystemAuthority)
    private readonly shopManagerSystemAuthorityRepository: Repository<ShopManagerSystemAuthority>
  ) {}

  async login(loginInfo: UserLoginDto) {
    const shop = await this.shopRepository
      .createQueryBuilder('shop')
      .addSelect('shop.shop_password')
      .where(`shop_account = :sa`, { sa: loginInfo.shopAccount })
      .getOne();

    if (!shop) throw new HttpException('商家账号不存在', HttpStatus.BAD_REQUEST);

    const validShopPassword = await bcrypt.compare(loginInfo.shopPassword, shop.shop_password);
    if (!validShopPassword) throw new HttpException('商家密码错误', HttpStatus.BAD_REQUEST);

    const shopManager = await this.shopManagerRepository
      .createQueryBuilder('shop_manager')
      .leftJoinAndSelect('shop_manager.shop_manager_role', 'shop_manager_role')
      .addSelect('shop_manager.shop_manager_password')
      .where(`shop_manager.shop_manager_account = :sma`, { sma: loginInfo.userAccount })
      .andWhere(`shop_manager.shop_id = :sid`, { sid: shop._id })
      .getOne();

    if (!shopManager) throw new HttpException('管理者账号不存在', HttpStatus.BAD_REQUEST);

    const validShopManagerPassword = await bcrypt.compare(loginInfo.userPassword, shopManager.shop_manager_password);
    if (!validShopManagerPassword) throw new HttpException('管理者密码错误', HttpStatus.BAD_REQUEST);

    let routesName: ShopManagerSystemAuthority[] = [];

    if (shopManager.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')) {
      routesName = await this.shopManagerSystemAuthorityRepository
        .createQueryBuilder('authority')
        .leftJoinAndSelect('authority.children', 'children')
        .where('authority.parentMenu IS NULL')
        .getMany();
    } else {
      for (const role of shopManager.shop_manager_role) {
        routesName = objectToArrayObject(
          merge(
            arrayObjectToObject(deepCopy(routesName)),
            arrayObjectToObject(deepCopy(role.shop_manager_role_authority))
          )
        );
      }
    }

    const buttons = getAuthority(routesName, false);

    const jwt = sign(
      {
        shopId: shop._id,
        userId: shopManager._id,
      },
      SECRCT,
      { expiresIn: 10 }
    );

    delete shopManager.shop_manager_password;

    delete shopManager.shop_manager_password;

    return {
      jwt,
      userInfo: shopManager,
      routesName,
      buttons,
    };
  }

  async getUserInfo(req: Request) {
    const { shopId, userId } = verify(req.headers.authorization, SECRCT) as any;

    const shopManager = await this.shopManagerRepository.findOne({
      relations: ['shop_manager_role'],
      where: { _id: userId, shop_id: shopId },
    });

    if (!shopManager) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);

    let routesName: ShopManagerSystemAuthority[] = [];

    if (shopManager.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')) {
      routesName = await this.shopManagerSystemAuthorityRepository
        .createQueryBuilder('authority')
        .leftJoinAndSelect('authority.children', 'children')
        .where('authority.parentMenu IS NULL')
        .getMany();
    } else {
      for (const role of shopManager.shop_manager_role) {
        routesName = objectToArrayObject(
          merge(
            arrayObjectToObject(deepCopy(routesName)),
            arrayObjectToObject(deepCopy(role.shop_manager_role_authority))
          )
        );
      }
    }

    const buttons = getAuthority(routesName, false);

    return {
      userInfo: shopManager,
      routesName,
      buttons,
    };
  }
}

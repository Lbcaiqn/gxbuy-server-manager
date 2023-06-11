import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopManager } from '@/modules/user/entities/shop_manager.entity';
import { verify } from 'jsonwebtoken';
import { SECRCT } from '../secrct';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ShopManager) private readonly shopManagerRepository: Repository<ShopManager>
  ) {}

  getAuth(
    data: any,
    auth: any = {
      menu: [],
      button: [],
    }
  ): any {
    let authority = auth;

    for (const i of data) {
      if (i.name) authority.menu.push(i.name);
      if (i?.button?.length > 0)
        authority.button = [...authority.button, ...(i?.button?.map((v: any) => v.value) || [])];

      if (i?.children?.length > 0) authority = this.getAuth(i.children, authority);
    }

    return authority;
  }

  async auth(userId: string, shopId: string, authorityInfo: any): Promise<boolean> {
    const user = await this.shopManagerRepository.findOne({
      relations: ['shop_manager_role'],
      where: { _id: userId, shop_id: shopId },
    });

    if (!user) throw new HttpException('您没有该权限', HttpStatus.UNAUTHORIZED);
    if (user.shop_manager_role.length === 0) throw new HttpException('您没有该权限', HttpStatus.UNAUTHORIZED);

    if (user.shop_manager_role.map((role: any) => role.shop_manager_role_name).includes('admin')) return true;

    for (const role of user.shop_manager_role) {
      if (!role.shop_manager_role_authority) continue;

      const { menu, button } = this.getAuth(role.shop_manager_role_authority);

      if (authorityInfo.isBtn) {
        if (button.includes(authorityInfo.value)) return true;
      } else {
        if (menu.includes(authorityInfo.value)) return true;
      }
    }

    throw new HttpException('您没有该权限', HttpStatus.UNAUTHORIZED);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authority = this.reflector.get<string[]>('auth', context.getHandler());

    if (!authority) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const jwt = req.headers.authorization;
    if (!jwt) throw new HttpException('您未登录，或登录过期', HttpStatus.FORBIDDEN);

    let id: any = null;
    try {
      id = verify(jwt, SECRCT);
    } catch (err) {
      throw new HttpException('您未登录，或登录过期', HttpStatus.FORBIDDEN);
    }

    const { shopId, userId } = id;

    return this.auth(userId, shopId, authority);
  }
}

import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, Like } from 'typeorm';
import { ShopManager } from '../user/entities/shop_manager.entity';
import { ShopManagerRole } from '../user/entities/shop_manager_role.entity';
import { ShopManagerSystemAuthority } from '../user/entities/shop_manager_system_authority.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { getAuthority } from '@/tools/authority';
import { verify } from 'jsonwebtoken';
import { SECRCT } from '@/common/secrct';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(ShopManager) private readonly shopManagerRepository: Repository<ShopManager>,
    @InjectRepository(ShopManagerRole) private readonly shopManagerRoleRepository: Repository<ShopManagerRole>,
    @InjectRepository(ShopManagerSystemAuthority)
    private readonly shopManagerSystemAuthorityRepository: Repository<ShopManagerSystemAuthority>
  ) {}

  async getAuthorityData() {
    const authorityData = await this.shopManagerSystemAuthorityRepository
      .createQueryBuilder('authority')
      .leftJoinAndSelect('authority.children', 'children')
      .where('authority.parentMenu IS NULL')
      .getMany();

    authorityData.pop();
    getAuthority(authorityData, false);

    return authorityData;
  }

  async getRoleList(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;
    const { keyword, pageSize, page } = req.query as any;

    const whereInfo: any = { shop_id: shopId };
    if (keyword && typeof keyword === 'string') whereInfo.shop_manager_role_name = Like(`%${keyword}%`);

    const roleList = await this.shopManagerRoleRepository.findAndCount({
      where: whereInfo,
      skip: (page - 1) * pageSize || 0,
      take: pageSize || 30,
      order: { update_time: 'desc' },
    });

    for (const i of roleList[0]) {
      if (i.shop_manager_role_authority) getAuthority(i.shop_manager_role_authority, true);
    }

    return {
      total: roleList[1],
      data: roleList[0],
    };
  }

  async addRole(req: Request, createInfo: CreateRoleDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const role = new ShopManagerRole();

    role.shop_manager_role_name = createInfo.roleName;
    role.shop_manager_role_authority = createInfo.authority;
    role.shop_id = shopId;

    try {
      await this.shopManagerRoleRepository.save(role);
    } catch (err: any) {
      throw new HttpException('角色名已存在', HttpStatus.BAD_REQUEST);
    }

    return '新增角色成功';
  }

  async updateRole(req: Request, updateInfo: UpdateRoleDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const role = await this.shopManagerRoleRepository.findOne({
      where: { _id: updateInfo.roleId, shop_id: shopId },
    });

    if (!role) throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);

    if (role?.shop_manager_role_name === 'admin') {
      throw new HttpException('admin不可修改', HttpStatus.BAD_REQUEST);
    }

    role.shop_manager_role_name = updateInfo.roleName;
    role.shop_manager_role_authority = updateInfo.authority;
    role.update_time = new Date();

    try {
      await this.shopManagerRoleRepository.update(role._id, role);
    } catch (err: any) {
      throw new HttpException('角色名已存在', HttpStatus.BAD_REQUEST);
    }

    return '修改成功';
  }

  async deleteRole(req: Request, roleId: string) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const role = await this.shopManagerRoleRepository.findOne({ where: { _id: roleId, shop_id: shopId } });

    if (role?.shop_manager_role_name === 'admin') {
      throw new HttpException('admin不可删除', HttpStatus.BAD_REQUEST);
    }

    await this.shopManagerRoleRepository.delete(role._id);

    return '删除成功';
  }

  // --------------------------------------------------------------------------
  async getRoleData(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const roleData = (
      await this.shopManagerRoleRepository.find({
        where: { shop_id: shopId },
      })
    ).map((i: any) => {
      return {
        _id: i._id,
        roleName: i.shop_manager_role_name,
      };
    });

    return roleData;
  }

  async getManagerList(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;
    const { keyword, pageSize, page } = req.query as any;

    const whereInfo: any = { shop_id: shopId };
    if (keyword && typeof keyword === 'string') whereInfo.shop_manager_name = Like(`%${keyword}%`);

    const roleList = await this.shopManagerRepository.findAndCount({
      relations: ['shop_manager_role'],
      where: whereInfo,
      skip: (page - 1) * pageSize || 0,
      take: pageSize || 30,
      order: { update_time: 'desc' },
    });

    return {
      total: roleList[1],
      data: roleList[0],
    };
  }

  async addManager(req: Request, createInfo: CreateManagerDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const roles =
      createInfo.roleIds.length !== 0
        ? await this.shopManagerRoleRepository
            .createQueryBuilder('role')
            .where(`_id IN (${createInfo.roleIds})`)
            .andWhere('shop_id = :id', { id: shopId })
            .getMany()
        : [];

    const manager = new ShopManager();

    manager.shop_manager_account = createInfo.managerAccount;
    manager.shop_manager_password = await bcrypt.hash(createInfo.managerPassword, 10);
    manager.shop_manager_name = createInfo.managerName;
    manager.shop_id = shopId;
    manager.shop_manager_role = roles;

    try {
      await this.shopManagerRepository.save(manager);
    } catch (err: any) {
      throw new HttpException('账号已存在', HttpStatus.BAD_REQUEST);
    }

    return '新增角色成功';
  }

  async updateManager(req: Request, updateInfo: UpdateManagerDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const manager = await this.shopManagerRepository.findOne({
      relations: ['shop_manager_role'],
      where: { _id: updateInfo.managerId, shop_id: shopId },
    });

    if (!manager) throw new HttpException('管理者不存在', HttpStatus.BAD_REQUEST);

    const roles =
      updateInfo.roleIds.length !== 0
        ? await this.shopManagerRoleRepository
            .createQueryBuilder('role')
            .where(`_id IN (${updateInfo.roleIds})`)
            .andWhere('shop_id = :id', { id: shopId })
            .getMany()
        : [];

    if (
      !roles.map((i: any) => i.shop_manager_role_name).includes('admin') &&
      manager.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')
    ) {
      const managers = await this.shopManagerRepository.find({
        relations: ['shop_manager_role'],
        where: { shop_id: shopId },
      });

      const admins = managers.filter((i: any) =>
        i.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')
      );

      if (admins.length <= 1) throw new HttpException('至少要保留一个admin权限的用户', HttpStatus.BAD_REQUEST);
    }

    manager.shop_manager_account = updateInfo.managerAccount;
    manager.shop_manager_name = updateInfo.managerName;
    manager.shop_manager_role = roles;
    manager.update_time = new Date();

    try {
      await this.shopManagerRepository.save(manager);
    } catch (err: any) {
      console.log(err);
      throw new HttpException('账号已存在', HttpStatus.BAD_REQUEST);
    }

    return '修改成功';
  }

  async deleteManager(req: Request, managerId: string) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const manager = await this.shopManagerRepository.findOne({
      relations: ['shop_manager_role'],
      where: { _id: managerId, shop_id: shopId },
    });

    if (manager.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')) {
      const managers = await this.shopManagerRepository.find({
        relations: ['shop_manager_role'],
        where: { shop_id: shopId },
      });

      const admins = managers.filter((i: any) =>
        i.shop_manager_role.map((i: any) => i.shop_manager_role_name).includes('admin')
      );

      if (admins.length <= 1) throw new HttpException('至少要保留一个admin权限的用户', HttpStatus.BAD_REQUEST);
    }

    await this.shopManagerRepository.delete(manager._id);

    return '删除成功';
  }
}

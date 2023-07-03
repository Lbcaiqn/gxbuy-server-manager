import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, Like } from 'typeorm';
import { GoodsSpu } from './entities/goods_spu.entity';
import { GoodsSku } from './entities/goods_sku.entity';
import { GoodsImg } from './entities/goods_img.entity';
import { Category } from './entities/category.entity';
import { CreateGoodsSpuDto } from './dto/create-goods-spu.dto';
import { CreateGoodsSkuDto } from './dto/create-goods-sku.dto';
import { UpdateGoodsSpuDto } from './dto/update-goods-spu.dto';
import { UpdateGoodsSkuDto } from './dto/update-goods-sku.dto';
import { GroundGoodsDto } from './dto/ground-goods.dto';
import { verify } from 'jsonwebtoken';
import { SECRCT } from '@/common/secrct';

enum GoodsImgType {
  BANNER = 'banner',
  DETAIL = 'detail',
}

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(GoodsSpu) private readonly goodsSpuRepository: Repository<GoodsSpu>,
    @InjectRepository(GoodsSku) private readonly goodsSkuRepository: Repository<GoodsSku>,
    @InjectRepository(GoodsImg) private readonly goodsImgRepository: Repository<GoodsImg>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  async getCategoryData() {
    const data = await this.categoryRepository.find({
      relations: ['children', 'children.children'],
      where: { cat_level: 0 },
    });

    return data;
  }

  async getGoodsSpuList(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const { keyword, pageSize, page } = req.query as any;

    const whereInfo: any = { shop_id: shopId };
    if (keyword && typeof keyword === 'string') whereInfo.goods_spu_name = Like(`%${keyword}%`);

    const data = await this.goodsSpuRepository.findAndCount({
      relations: ['goods_img', 'goods_sku'],
      where: whereInfo,
      skip: (page - 1) * pageSize || 0,
      take: pageSize || 30,
      order: { update_time: 'desc' },
    });

    return {
      total: data[1],
      data: data[0],
    };
  }

  async getGoodsSkuList(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const { goodsSpuId } = req.query as any;

    if (!goodsSpuId) throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);

    const data: any = await this.goodsSkuRepository.findAndCount({
      where: { shop_id: shopId, goods_spu_id: goodsSpuId },
      order: { update_time: 'desc' },
    });

    return {
      total: data[1],
      data: data[0],
    };
  }

  async createGoodsSpu(req: Request, createInfo: CreateGoodsSpuDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    if (createInfo.spuSalesAttrs.length === 0) new HttpException('至少需要一条销售属性', HttpStatus.BAD_REQUEST);

    const spu = new GoodsSpu();
    const goodsImgBanner = new GoodsImg();
    const goodsImgDetail = new GoodsImg();

    spu.goods_spu_name = createInfo.goodsSpuName;
    spu.goods_spu_main_img = createInfo.goodsSpuMainImg;
    spu.c1id = createInfo.c1id;
    spu.c2id = createInfo.c2id;
    spu.c3id = createInfo.c3id;
    spu.cid = createInfo.c3id;
    spu.shop_id = shopId;
    spu.spu_sales_attrs = createInfo.spuSalesAttrs;

    goodsImgBanner.goods_img_list = createInfo.bannerImgList.map((i: string) => {
      return {
        description: null,
        url: i,
      };
    });
    goodsImgBanner.goods_img_type = GoodsImgType.BANNER;
    goodsImgBanner.shop_id = shopId;
    goodsImgBanner.goods_spu = spu;

    goodsImgDetail.goods_img_list = createInfo.detailImgList.map((i: string) => {
      return {
        description: null,
        url: i,
      };
    });
    goodsImgDetail.goods_img_type = GoodsImgType.DETAIL;
    goodsImgDetail.shop_id = shopId;
    goodsImgDetail.goods_spu = spu;

    await this.goodsSpuRepository.save(spu);
    await this.goodsImgRepository.save(goodsImgBanner);
    await this.goodsImgRepository.save(goodsImgDetail);

    return '新增SPU成功';
  }

  async createGoodsSku(req: Request, createInfo: CreateGoodsSkuDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const spu = await this.goodsSpuRepository.findOne({
      relations: ['goods_sku'],
      where: { _id: createInfo.goodsSpuId, shop_id: shopId },
    });

    if (!spu) throw new HttpException('SPU不存在', HttpStatus.BAD_REQUEST);

    // 判断sku是否已存在
    const newKeys = Object.keys(createInfo.skuSalesAttrs).sort();
    const newSkuSalesAttrs = newKeys.reduce((o: any, key: string) => {
      o[key] = createInfo.skuSalesAttrs[key];
      return o;
    }, {});

    for (const i of spu.goods_sku) {
      const keys = Object.keys(i.sku_sales_attrs).sort();
      const skuSalesAttrs = keys.reduce((o: any, key: string) => {
        o[key] = i.sku_sales_attrs[key];
        return o;
      }, {});

      if (JSON.stringify(newSkuSalesAttrs) === JSON.stringify(skuSalesAttrs)) {
        throw new HttpException('SKU已存在，请重新选择销售属性', HttpStatus.BAD_REQUEST);
      }
    }

    const sku = new GoodsSku();

    sku.goods_sku_name = createInfo.goodsSkuName;
    sku.goods_sku_img = createInfo.goodsSkuImg;
    sku.goods_sku_price = String(Math.abs(Number(createInfo.goodsSkuPrice)));
    sku.goods_sku_stock = Math.floor(Math.abs(createInfo.goodsSkuStock));
    sku.c1id = spu.c1id;
    sku.c2id = spu.c2id;
    sku.c3id = spu.c3id;
    sku.cid = spu.cid;
    sku.goods_spu_id = spu._id;
    sku.shop_id = shopId;
    sku.sku_sales_attrs = createInfo.skuSalesAttrs;

    await this.goodsSkuRepository.save(sku);

    spu.goods_first_sku_price = spu.goods_sku.length === 0 ? sku.goods_sku_price : spu.goods_sku[0].goods_sku_price;
    spu.goods_sku_total_stock += sku.goods_sku_stock;

    delete spu.goods_sku;
    await this.goodsSpuRepository.update(spu._id, spu);

    return '新增SKU成功';
  }

  async updateGoodsSpu(req: Request, updateInfo: UpdateGoodsSpuDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    if (updateInfo.spuSalesAttrs.length === 0) new HttpException('至少需要一条销售属性', HttpStatus.BAD_REQUEST);

    const spu = await this.goodsSpuRepository.findOne({
      where: { _id: updateInfo.goodsSpuId, shop_id: shopId },
    });

    const goodsImgBanner = await this.goodsImgRepository.findOne({
      where: { goods_spu_id: updateInfo.goodsSpuId, shop_id: shopId, goods_img_type: GoodsImgType.BANNER },
    });

    const goodsImgDetail = await this.goodsImgRepository.findOne({
      where: { goods_spu_id: updateInfo.goodsSpuId, shop_id: shopId, goods_img_type: GoodsImgType.DETAIL },
    });

    if (!spu || !goodsImgBanner || !goodsImgDetail) throw new HttpException('SPU不存在', HttpStatus.BAD_REQUEST);

    spu.goods_spu_name = updateInfo.goodsSpuName;
    spu.goods_spu_main_img = updateInfo.goodsSpuMainImg;
    spu.c1id = updateInfo.c1id;
    spu.c2id = updateInfo.c2id;
    spu.c3id = updateInfo.c3id;
    spu.cid = updateInfo.c3id;
    spu.spu_sales_attrs = updateInfo.spuSalesAttrs;
    spu.update_time = new Date();

    goodsImgBanner.goods_img_list = updateInfo.bannerImgList.map((i: string) => {
      return {
        description: null,
        url: i,
      };
    });

    goodsImgDetail.goods_img_list = updateInfo.detailImgList.map((i: string) => {
      return {
        description: null,
        url: i,
      };
    });

    await this.goodsSpuRepository.update(spu._id, spu);
    await this.goodsImgRepository.update(goodsImgBanner._id, goodsImgBanner);
    await this.goodsImgRepository.update(goodsImgDetail._id, goodsImgDetail);

    return '修改成功';
  }

  async updateGoodsSku(req: Request, updateInfo: UpdateGoodsSkuDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    let spu = await this.goodsSpuRepository.findOne({
      relations: ['goods_sku'],
      where: { _id: updateInfo.goodsSpuId, shop_id: shopId },
    });

    if (!spu) throw new HttpException('SPU不存在', HttpStatus.BAD_REQUEST);

    const sku = await this.goodsSkuRepository.findOne({
      where: { _id: updateInfo.goodsSkuId, goods_spu_id: updateInfo.goodsSpuId, shop_id: shopId },
    });

    if (!sku) throw new HttpException('SKU不存在', HttpStatus.BAD_REQUEST);

    const newKeys = Object.keys(updateInfo.skuSalesAttrs).sort();
    const newSkuSalesAttrs = newKeys.reduce((o: any, key: string) => {
      o[key] = updateInfo.skuSalesAttrs[key];
      return o;
    }, {});

    const oldKeys = Object.keys(sku.sku_sales_attrs).sort();
    const oldSkuSalesAttrs = oldKeys.reduce((o: any, key: string) => {
      o[key] = sku.sku_sales_attrs[key];
      return o;
    }, {});

    if (JSON.stringify(newSkuSalesAttrs) !== JSON.stringify(oldSkuSalesAttrs)) {
      // 判断sku是否已存在
      for (const i of spu.goods_sku) {
        const keys = Object.keys(i.sku_sales_attrs).sort();
        const skuSalesAttrs = keys.reduce((o: any, key: string) => {
          o[key] = i.sku_sales_attrs[key];
          return o;
        }, {});

        if (JSON.stringify(newSkuSalesAttrs) === JSON.stringify(skuSalesAttrs)) {
          throw new HttpException('SKU已存在，请重新选择销售属性', HttpStatus.BAD_REQUEST);
        }
      }
    }

    const oldStock = sku.goods_sku_stock;

    sku.goods_sku_name = updateInfo.goodsSkuName;
    sku.goods_sku_img = updateInfo.goodsSkuImg;
    sku.sku_sales_attrs = updateInfo.skuSalesAttrs;
    sku.goods_sku_price = String(Math.abs(Number(updateInfo.goodsSkuPrice)));
    sku.goods_sku_stock = Math.floor(Math.abs(Number(updateInfo.goodsSkuStock)));
    sku.update_time = new Date();

    await this.goodsSkuRepository.update(sku._id, sku);

    spu = await this.goodsSpuRepository.findOne({
      relations: ['goods_sku'],
      where: { _id: updateInfo.goodsSpuId, shop_id: shopId },
    });

    spu.goods_first_sku_price = spu.goods_sku.length === 0 ? sku.goods_sku_price : spu.goods_sku[0].goods_sku_price;
    spu.goods_sku_total_stock = spu.goods_sku_total_stock - oldStock <= 0 ? 0 : spu.goods_sku_total_stock - oldStock;
    spu.goods_sku_total_stock += sku.goods_sku_stock;
    delete spu.goods_sku;
    await this.goodsSpuRepository.update(spu._id, spu);

    return '修改成功';
  }

  async deleteGoodsSpu(req: Request, goodsSpuId: string) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const spu = await this.goodsSpuRepository.findOne({
      where: { _id: goodsSpuId, shop_id: shopId },
    });

    if (!spu) throw new HttpException('SPU不存在', HttpStatus.BAD_REQUEST);

    await this.goodsSpuRepository.delete(spu._id);

    return '删除成功';
  }

  async deleteGoodsSku(req: Request, goodsSkuId: string) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const sku = await this.goodsSkuRepository.findOne({
      where: { _id: goodsSkuId, shop_id: shopId },
    });

    if (!sku) throw new HttpException('SKU不存在', HttpStatus.BAD_REQUEST);

    await this.goodsSkuRepository.delete(sku._id);

    const spu = await this.goodsSpuRepository.findOne({
      relations: ['goods_sku'],
      where: { _id: sku.goods_spu_id, shop_id: shopId },
    });

    if (spu) {
      spu.goods_first_sku_price = spu.goods_sku.length === 0 ? '0.00' : spu.goods_sku[0].goods_sku_price;
      spu.goods_sku_total_stock =
        spu.goods_sku_total_stock - sku.goods_sku_stock <= 0 ? 0 : spu.goods_sku_total_stock - sku.goods_sku_stock;
      if (spu.goods_sku.length === 0) spu.isGrounding = false;
      delete spu.goods_sku;
      await this.goodsSpuRepository.update(spu._id, spu);
    }

    return '删除成功';
  }

  async ground(req: Request, groundInfo: GroundGoodsDto) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    if (groundInfo.goodsSpuId) {
      const spu = await this.goodsSpuRepository.findOne({
        relations: ['goods_sku'],
        where: { _id: groundInfo.goodsSpuId, shop_id: shopId },
      });

      if (!spu) throw new HttpException('spu不存在', HttpStatus.BAD_REQUEST);

      for (const i of spu.goods_sku) {
        i.isGrounding = groundInfo.ground;
        await this.goodsSkuRepository.update(i._id, i);
      }

      if (!(spu.goods_sku.length === 0 && groundInfo.ground)) {
        spu.isGrounding = groundInfo.ground;
        delete spu.goods_sku;
        await this.goodsSpuRepository.update(spu._id, spu);
      }

      return `全部${groundInfo.ground ? '上架' : '下架'}成功`;
    } else if (groundInfo.goodsSkuId) {
      const sku = await this.goodsSkuRepository.findOne({
        where: { _id: groundInfo.goodsSkuId, shop_id: shopId },
      });

      if (!sku) throw new HttpException('sku不存在', HttpStatus.BAD_REQUEST);

      sku.isGrounding = groundInfo.ground;
      await this.goodsSkuRepository.update(sku._id, sku);

      const spu = await this.goodsSpuRepository.findOne({
        relations: ['goods_sku'],
        where: { _id: sku.goods_spu_id, shop_id: shopId },
      });

      if (groundInfo.ground === true && spu.isGrounding === false) {
        spu.isGrounding = true;
        delete spu.goods_sku;
        await this.goodsSpuRepository.update(spu._id, spu);
      } else if (groundInfo.ground === false) {
        for (let i in spu.goods_sku) {
          if (spu.goods_sku[i].isGrounding) break;

          if (Number(i) >= spu.goods_sku.length - 1) {
            spu.isGrounding = false;
            delete spu.goods_sku;
            await this.goodsSpuRepository.update(spu._id, spu);
          }
        }
      }

      return `${groundInfo.ground ? '上架' : '下架'}成功`;
    } else {
      return '';
    }
  }
}

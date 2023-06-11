import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { GoodsSpu } from '@/modules/goods/entities/goods_spu.entity';
import { GoodsSku } from '@/modules/goods/entities/goods_sku.entity';
import { GoodsImg } from '@/modules/goods/entities/goods_img.entity';
import { ShopManager } from './shop_manager.entity';
import { ShopManagerRole } from './shop_manager_role.entity';

@Entity()
@Index('idx_unique_shop_account_name', ['shop_account', 'shop_name'], { unique: true })
export class Shop {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  _id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  shop_account: string;

  @Column({ type: 'varchar', length: 100, nullable: false, select: false })
  shop_password: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  shop_name: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  shop_logo: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  add_time: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  update_time: Date;

  @OneToMany(() => GoodsSpu, gspu => gspu.shop)
  goods_spu: GoodsSpu[];

  @OneToMany(() => GoodsSku, gsku => gsku.shop)
  goods_sku: GoodsSku[];

  @OneToMany(() => GoodsImg, gi => gi.goods_spu)
  goods_img: GoodsImg[];

  @OneToMany(() => ShopManagerRole, smr => smr.shop)
  shop_manager_role: ShopManagerRole[];

  @OneToMany(() => ShopManager, sm => sm.shop)
  shop_manager: ShopManager[];
}

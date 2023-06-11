import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { GoodsSku } from './goods_sku.entity';
import { GoodsImg } from './goods_img.entity';
import { Shop } from '@/modules/user/entities/shop.entity';

@Entity()
export class GoodsSpu {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  _id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  goods_spu_name: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  goods_spu_main_img: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: '0.00',
  })
  goods_first_sku_price: string;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  goods_sku_total_sales: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  goods_sku_total_stock: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  goods_spu_total_favorite: number;

  @Column({ type: 'json', nullable: true })
  spu_sales_attrs: Array<{ name: string; values: Array<string> }>;

  @Column({ type: 'boolean', nullable: false, default: false })
  isGrounding: boolean;

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

  @Index()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  cid: number;

  @Index()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  c1id: number;

  @Index()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  c2id: number;

  @Index()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  c3id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, nullable: true })
  shop_id: string;

  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'cid' })
  cid_msg: Category;

  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'c1id' })
  c1id_msg: Category;

  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'c2id' })
  c2id_msg: Category;

  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'c3id' })
  c3id_msg: Category;

  @ManyToOne(() => Shop, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @OneToMany(() => GoodsSku, gsku => gsku.goods_spu)
  goods_sku: GoodsSku[];

  @OneToMany(() => GoodsImg, gi => gi.goods_spu)
  goods_img: GoodsImg[];
}

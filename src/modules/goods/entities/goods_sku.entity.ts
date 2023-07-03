import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { GoodsSpu } from './goods_spu.entity';
import { Shop } from '@/modules/user/entities/shop.entity';

@Entity()
export class GoodsSku {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  _id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  goods_sku_name: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  goods_sku_img: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: '0.00',
  })
  goods_sku_price: string;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  goods_sku_sales: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  goods_sku_stock: number;

  @Column({ type: 'json', nullable: true })
  sku_sales_attrs: Array<{ name: string; value: string }>;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 100 })
  max_single_buy_quantity: number;

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

  @Index()
  @Column({ type: 'bigint', unsigned: true, nullable: true })
  goods_spu_id: string;

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

  @ManyToOne(() => GoodsSpu, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'goods_spu_id' })
  goods_spu: GoodsSpu;
}

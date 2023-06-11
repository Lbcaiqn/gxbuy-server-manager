import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { GoodsSpu } from '@/modules/goods/entities/goods_spu.entity';
import { GoodsSku } from '@/modules/goods/entities/goods_sku.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: 'smallint', unsigned: true })
  _id: number;

  @Column({ type: 'tinyint', unsigned: true, nullable: false })
  cat_level: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  cat_name: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  cat_icon: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  add_time: Date;

  @Index()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  cat_pid: number;

  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'cat_pid' })
  parent: Category;

  @OneToMany(() => Category, cat => cat.parent)
  children: Category[];

  @OneToMany(() => GoodsSpu, gspu => gspu.cid_msg)
  goods_spu_is_cid: GoodsSpu[];

  @OneToMany(() => GoodsSpu, gspu => gspu.c1id_msg)
  goods_spu_is_c1id: GoodsSpu[];

  @OneToMany(() => GoodsSpu, gspu => gspu.c2id_msg)
  goods_spu_is_c2id: GoodsSpu[];

  @OneToMany(() => GoodsSpu, gspu => gspu.c3id_msg)
  goods_spu_is_c3id: GoodsSpu[];

  @OneToMany(() => GoodsSku, gsku => gsku.cid_msg)
  goods_sku_is_cid: GoodsSku[];

  @OneToMany(() => GoodsSku, gsku => gsku.c1id_msg)
  goods_sku_is_c1id: GoodsSku[];

  @OneToMany(() => GoodsSku, gsku => gsku.c2id_msg)
  goods_sku_is_c2id: GoodsSku[];

  @OneToMany(() => GoodsSku, gsku => gsku.c3id_msg)
  goods_sku_is_c3id: GoodsSku[];
}

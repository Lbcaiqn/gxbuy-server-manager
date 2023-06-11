import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Shop } from './shop.entity';
import { ShopManager } from './shop_manager.entity';

interface AuthorityInterface {
  _id: number;
  name: string;
  title: string;
  button?: Array<{ name: string; value: string }> | null;
  children?: Array<AuthorityInterface> | null;
}

@Entity()
@Index('idx_unique_role_name_by_shop', ['shop_manager_role_name', 'shop_id'], { unique: true })
export class ShopManagerRole {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  _id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  shop_manager_role_name: string;

  @Column({ type: 'json', nullable: true, default: null })
  shop_manager_role_authority: Array<AuthorityInterface>;

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
  @Column({ type: 'bigint', unsigned: true, nullable: true })
  shop_id: string;

  @ManyToOne(() => Shop, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToMany(() => ShopManager, { createForeignKeyConstraints: false })
  @JoinTable({ name: 'sm_mtm_smr' })
  shop_manager: ShopManager[];
}

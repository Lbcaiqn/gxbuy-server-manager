import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Shop } from '@/modules/user/entities/shop.entity';

enum StateType {
  WAITPAID = 'wait_paid',
  WAITSHIPPED = 'wait_shipped',
  WAITRECEIVE = 'wait_receive',
  WAITCOMMENT = 'wait_comment',
  FINISH = 'finish',
  CANCEL = 'cancel',
  INVALID = 'invalid',
}

@Entity()
export class OrderInformation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  _id: string;

  @Column({
    type: 'enum',
    enum: StateType,
  })
  order_state: StateType;

  @Column({ type: 'varchar', length: 30, nullable: false, default: '' })
  order_notes: string;

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
  user_id: string;

  @Index()
  @Column({ type: 'bigint', unsigned: true })
  shop_id: string;

  @ManyToOne(() => Shop, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @OneToMany(() => OrderItem, oitem => oitem.order_information)
  order_item: OrderItem[];
}

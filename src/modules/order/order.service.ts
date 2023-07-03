import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order_item.entity';
import { verify } from 'jsonwebtoken';
import { SECRCT } from '@/common/secrct';

enum StateType {
  WAITPAID = 'wait_paid',
  WAITSHIPPED = 'wait_shipped',
  WAITRECEIVE = 'wait_receive',
  WAITCOMMENT = 'wait_comment',
  FINISH = 'finish',
  CANCEL = 'cancel',
  INVALID = 'invalid',
}

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>) {}

  async getSalesData(req: Request) {
    const { shopId } = verify(req.headers.authorization, SECRCT) as any;

    const data: any = {
      seasonSales: [
        { value: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, name: '春季' },
        { value: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, name: '夏季' },
        { value: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, name: '秋季' },
        { value: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, name: '冬季' },
      ],
      monthCount: [],
      monthSales: [],
      sex: {
        man: Math.floor(Math.random() * (80 - 10 + 1)) + 10,
      },
    };

    data.sex.woman = 100 - data.sex.man;

    for (let i = 0; i < 12; i++) {
      data['monthCount'].push(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
      data['monthSales'].push(Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000);
    }

    return data;
  }
}

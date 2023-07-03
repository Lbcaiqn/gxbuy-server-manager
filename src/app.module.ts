import { Module } from '@nestjs/common';
import { GoodsModule } from './modules/goods/goods.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthorityModule } from './modules/authority/authority.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    GoodsModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'root',
      password: 'Lgx123456@@',
      host: 'localhost',
      port: 3306,
      database: 'gxbuy',
      // synchronize: true,
      retryDelay: 500,
      retryAttempts: 10,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    AuthorityModule,
    OrderModule,
  ],
})
export class AppModule {}

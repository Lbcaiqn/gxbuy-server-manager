import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';
import * as session from 'express-session';
import { ResponseInterceptor } from './common/response-interceptor';
import { HttpFilter } from './common/http-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 接口版本
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 跨域
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // 静态文件夹
  app.useStaticAssets(join(__dirname, '../public'));

  // session，实现验证码需要用，登录则用jwt
  app.use(
    session({
      secret: 'asjlfhuig4145646g5sr4g65',
      rolling: true, //true每次请求后设置session会重新计时session过期时间
      name: 'gxbuy_PC', //session的name
      cookie: {
        maxAge: 3 * 60 * 1000, //过期时间，单位毫秒，如果是负数或null则是一次性的
      },
    })
  );

  // 接口文档
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Web接口文档')
    .setDescription('描述')
    .setVersion('1')
    .build();
  const docs = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, docs);

  // 响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 异常过滤器
  app.useGlobalFilters(new HttpFilter());

  // 端口
  await app.listen(3002);
}
bootstrap();

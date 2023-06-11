import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { escape } from 'querystring';

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 如果是服务器自己语法逻辑错误，则直接return
    if (!exception.getStatus) {
      console.log(exception);
      return;
    }

    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>(),
      res = ctx.getResponse<Response>(),
      next = ctx.getNext<NextFunction>();

    res.status(exception.getStatus()).json({
      sucess: false,
      time: new Date(),
      path: req.url,
      status: exception.getStatus(),
      errorMessage: exception.message,
    });
  }
}

// /src/common/ResponseInterceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Data<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<Data<T>> | Promise<Observable<Data<T>>> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          status: 200,
          messgae: '请求成功',
          sucess: true,
        };
      })
    );
  }
}

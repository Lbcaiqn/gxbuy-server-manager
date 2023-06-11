import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { SECRCT } from '../secrct';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authority = this.reflector.get<string[]>('jwt', context.getHandler());

    if (!authority) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const jwt = req.headers.authorization;
    if (!jwt) return false;

    try {
      verify(jwt, SECRCT);
    } catch (err) {
      return false;
    }

    return true;
  }
}

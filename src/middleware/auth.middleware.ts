import {
  Injectable,
  NestMiddleware,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { readFile } from 'fs/promises';
import { resolve } from 'path/posix';
import { fileConfig } from 'src/common/config';

@Injectable({ scope: Scope.REQUEST })
export class AuthMiddleware implements NestMiddleware {
  private adminFilePath = resolve(fileConfig.adminFilePath);

  async use(req: Request, res: Response, next: NextFunction) {
    const data = JSON.parse(await readFile(this.adminFilePath, 'utf-8'));
    const authHeader = req.headers.authorization;
    const token = `${data.email}${data.password}tracking-product`;
    if (authHeader != token) {
      throw new UnauthorizedException('Invalid token');
    }
    next();
  }
}

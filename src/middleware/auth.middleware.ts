import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.shema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token missing');
    }

    // Find the admin user (assuming only one admin exists)
    const admin = await this.adminModel.findOne().lean();
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const expectedToken = `${admin.email}${admin.password}tracking-product`;
    if (authHeader !== expectedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}

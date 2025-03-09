import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/admin/schemas/product.schema';
import { ServiceResponse, ProductDto } from 'src/models/dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findProduct(
    trackingCode: string,
    productId: string,
  ): Promise<ServiceResponse<ProductDto>> {
    const product = await this.productModel
      .findOne({
        $or: [{ trackingId: trackingCode }, { id: productId }],
      })
      .lean();

    if (!product) {
      return {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      message: 'Successful',
      success: true,
      status: HttpStatus.OK,
      data: product,
    };
  }
}

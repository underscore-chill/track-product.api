import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { model, Model } from 'mongoose';
import { ContactRequest, ProductDto, ServiceResponse } from '../models/dto';
import { Product, ProductDocument } from 'src/admin/schemas/product.schema';
import { Contact, ContactDocument } from 'src/admin/schemas/contact.schema';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.shema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  private readonly logger = new Logger(AdminService.name);

  async onModuleInit() {
    await this.initializeAdmin();
  }

  private async initializeAdmin() {
    const email = 'admin@email.com'; // Default admin email
    const password = 'Abcd@1234'; // Default admin password (hash this in production)

    const existingAdmin = await this.adminModel.findOne({ email }).exec();
    if (!existingAdmin) {
      await this.adminModel.create({ email, password });
      this.logger.log('Admin account created successfully.');
    } else {
      this.logger.log('Admin account already exists.');
    }
  }

  async addProduct(product: ProductDto): Promise<ServiceResponse<ProductDto>> {
    const productExist = await this.productModel.findOne({
      $or: [{ id: product.id }, { trackingId: product.trackingId }],
    });
    if (productExist) {
      return {
        message: 'Product exists',
        success: false,
        status: HttpStatus.CONFLICT,
      };
    }

    product.id = `TRK${Math.floor(10000 + Math.random() * 90000)}`;
    const newProduct = new this.productModel(product);
    await newProduct.save();

    return {
      message: 'Product added',
      success: true,
      data: newProduct,
      status: HttpStatus.CREATED,
    };
  }

  async updateProduct(
    productId: string,
    product: ProductDto,
  ): Promise<ServiceResponse<ProductDto>> {
    const updatedProduct = await this.productModel.findOneAndUpdate(
      { id: productId },
      product,
      { new: true },
    );

    if (!updatedProduct) {
      return {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }
    return {
      message: 'Product updated',
      success: true,
      data: updatedProduct,
      status: HttpStatus.OK,
    };
  }

  async deleteProduct(productId: string): Promise<ServiceResponse> {
    const deleted = await this.productModel.findOneAndDelete({
      $or: [{ id: productId }, { trackingId: productId }],
    });
    if (!deleted) {
      return {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }
    return { message: 'Product deleted', success: true, status: HttpStatus.OK };
  }

  async findProduct(
    trackingCode: string,
    productId: string,
  ): Promise<ServiceResponse<ProductDto>> {
    const product = await this.productModel.findOne({
      $or: [{ trackingId: trackingCode }, { id: productId }],
    });
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

  async getAllProducts(): Promise<ProductDto[]> {
    return this.productModel.find().exec();
  }

  async getAllContacts(): Promise<ContactRequest[]> {
    return this.contactModel.find().exec();
  }

  async contact(model: ContactRequest): Promise<ServiceResponse> {
    model.id = `contact-${Math.floor(10000 + Math.random() * 90000)}`;
    await new this.contactModel(model).save();
    return {
      message: 'Thanks for contacting us',
      success: true,
      status: HttpStatus.CREATED,
    };
  }

  async deleteContact(id: string): Promise<ServiceResponse> {
    const deleted = await this.contactModel.findOneAndDelete({ id });
    if (!deleted) {
      return {
        message: 'Contact not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
    }
    return { message: 'Contact deleted', success: true, status: HttpStatus.OK };
  }
}

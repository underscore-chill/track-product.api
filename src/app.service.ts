import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactRequest, ServiceResponse } from './models/dto';
import { Admin, AdminDocument } from './admin/schemas/admin.shema';
import { Contact, ContactDocument } from './admin/schemas/contact.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  getHello(): string {
    return 'See way delivery API!';
  }

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<ServiceResponse<{ token: string }>> {
    const admin = await this.adminModel.findOne({ email }).lean();

    if (admin && admin.password === password) {
      const token = `${admin.email}${admin.password}tracking-product`;

      return {
        message: 'Login successful',
        success: true,
        status: HttpStatus.OK,
        data: { token },
      };
    }

    return {
      message: 'Invalid credentials',
      success: false,
      status: HttpStatus.UNAUTHORIZED,
    };
  }

  async contact(model: ContactRequest): Promise<ServiceResponse> {
    model.id = `CONTACT${Math.floor(10000 + Math.random() * 90000)}`;
    await this.contactModel.create(model);

    return {
      message: 'Thanks for contacting us',
      success: true,
      status: HttpStatus.CREATED,
    };
  }

  async deleteContact(id: string): Promise<ServiceResponse> {
    await this.contactModel.deleteOne({ _id: id });

    return {
      message: 'Contact deleted successfully',
      success: true,
      status: HttpStatus.OK,
    };
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  senderName: string;
  @Prop({ required: true })
  receiverName: string;
  origin: string;
  @Prop({ required: true })
  destination: string;
  @Prop({ required: true })
  departureDate: string;
  @Prop({ required: true })
  arrivalDate: string;
  @Prop({ required: true })
  status: string;
  @Prop({ required: true })
  trackingId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

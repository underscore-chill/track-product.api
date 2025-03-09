import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TrackService } from './services/track.service';
import { TrackController } from './controllers/track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConfig } from './common/config';
import { ProductSchema } from './admin/schemas/product.schema';
import { ContactSchema } from './admin/schemas/contact.schema';
import { AdminSchema } from './admin/schemas/admin.shema';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${dbConfig.username}:${dbConfig.password}@delivway.0qkgy.mongodb.net/?retryWrites=true&w=majority&appName=DelivWay`,
    ),
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Contact', schema: ContactSchema },
      { name: 'Admin', schema: AdminSchema },
    ]),
  ],

  controllers: [AppController, AdminController, TrackController],
  providers: [AppService, AdminService, TrackService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('admin');
  }
}

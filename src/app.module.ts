import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { ScheduledTaskModule } from './scheduled-task/scheduled-task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    // MongoDB 连接配置
    MongooseModule.forRoot('mongodb://admin:password123@localhost:27017/nestjsrealworld?authSource=admin'),
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
    ScheduledTaskModule
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}

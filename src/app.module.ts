import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from './helper/helper.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { MessageQueueModule } from './message-queue/message-queue.module';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { RedisClientModule } from './redis-client/redis-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    LoggerModule,
    HelperModule,
    UserModule,
    BlogModule,
    MessageQueueModule,
    ElasticSearchModule,
    RedisClientModule,
  ],
  exports: [LoggerModule, RedisClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

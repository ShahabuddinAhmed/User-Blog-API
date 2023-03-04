import { ElasticSearchModule } from './../elastic-search/elastic-search.module';
import { ElasticSearchService } from './../elastic-search/elastic-search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './../blog/schemas/category.schema';
import { Module } from '@nestjs/common';
import { MessageQueueService } from './message-queue.service';
import { MessageQueueController } from './message-queue.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: process.env.RABBITMQ_QUEUE,
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Category',
        collection: 'category',
        schema: CategorySchema,
      },
    ]),
    ElasticSearchModule,
  ],
  providers: [MessageQueueService, ElasticSearchService],
  controllers: [MessageQueueController],
  exports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: process.env.RABBITMQ_QUEUE,
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class MessageQueueModule {}

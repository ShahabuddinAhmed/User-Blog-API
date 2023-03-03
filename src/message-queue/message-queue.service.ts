import { EventPatternType } from './../utils/utils.enum';
import { CategoryDocument } from './../blog/schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessageQueueService {
  constructor(
    @Inject('MESSAGE_PUBLISHER') public client: ClientProxy,
    @InjectModel('Category') public categoryModel: Model<CategoryDocument>,
  ) {}

  public async publish(pattern: EventPatternType, data: any) {
    this.client.emit<Record<string, unknown>>(pattern, data);
  }

  public async createdCategoryEventHandler(data: CategoryDocument) {
    console.log(data);
  }

  public async updatedCategoryEventHandler(data: CategoryDocument) {
    console.log(data);
  }
}

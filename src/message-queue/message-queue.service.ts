import { ElasticSearchService } from './../elastic-search/elastic-search.service';
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
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  public async publish(pattern: EventPatternType, data: any) {
    this.client.emit<Record<string, unknown>>(pattern, data);
  }

  public async createdCategoryEventHandler(data: CategoryDocument) {
    try {
      const response = await this.getCategory(data._id);
      await this.elasticSearchService.createOrUpdateCategory(response);
    } catch (err) {
      console.log(err);
    }
  }

  public async updatedCategoryEventHandler(data: CategoryDocument) {
    try {
      const response = await this.getCategory(data._id);
      await this.elasticSearchService.createOrUpdateCategory(response);
    } catch (err) {
      console.log(err);
    }
  }

  private async getCategory(
    categoryId: string,
  ): Promise<CategoryDocument | null> {
    return this.categoryModel
      .findById({ _id: categoryId })
      .populate('articles');
  }
}

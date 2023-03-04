import { CategoryDocument } from './../blog/schemas/category.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticSearchService implements OnModuleInit {
  constructor(public readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    // await this.createIndex();
  }

  public async createIndex() {
    const indexBody = {
      mappings: {
        properties: {
          name: { type: 'text' },
          slug: { type: 'keyword' },
          articles: { type: 'nested' },
        },
      },
    };

    const { body } = await this.elasticsearchService.indices.exists({
      index: process.env.INDICES,
    });

    // create index if it does not exist
    if (!body) {
      await this.elasticsearchService.indices.create({
        index: process.env.INDICES,
        body: indexBody,
      });
    }
  }

  public async createOrUpdateCategory(
    category: CategoryDocument,
  ): Promise<any> {
    const { body } = await this.elasticsearchService.index({
      id: String(category._id),
      index: process.env.INDICES,
      type: 'doc',
      refresh: 'true',
      body: category,
    });
  }
}

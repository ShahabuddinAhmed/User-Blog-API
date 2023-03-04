import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticSearchService } from './elastic-search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTIC_SEARCH_NODE,
      }),
    }),
  ],
  providers: [ElasticSearchService],
  exports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTIC_SEARCH_NODE,
      }),
    }),
  ],
})
export class ElasticSearchModule {}

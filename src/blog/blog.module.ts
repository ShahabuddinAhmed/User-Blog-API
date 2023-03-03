import { MessageQueueModule } from './../message-queue/message-queue.module';
import { MessageQueueService } from './../message-queue/message-queue.service';
import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { ArticleSchema } from './schemas/article.schema';
import { CommentSchema } from './schemas/comment.schema';
import { LikeSchema } from './schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Category',
        collection: 'category',
        schema: CategorySchema,
      },
      {
        name: 'Article',
        collection: 'article',
        schema: ArticleSchema,
      },
      {
        name: 'Comment',
        collection: 'comment',
        schema: CommentSchema,
      },
      {
        name: 'Like',
        collection: 'like',
        schema: LikeSchema,
      },
    ]),
    MessageQueueModule,
  ],
  providers: [BlogService, MessageQueueService],
  controllers: [BlogController],
})
export class BlogModule {}

import { CategoryDocument } from './../blog/schemas/category.schema';
import { EventPatternType } from './../utils/utils.enum';
import { MessageQueueService } from './message-queue.service';
import { LoggerService } from './../logger/logger.service';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('message-queue')
export class MessageQueueController {
  constructor(
    private readonly messageQueueService: MessageQueueService,
    private readonly loggerService: LoggerService,
  ) {}

  @EventPattern(EventPatternType.CREATED_CATEGORY)
  async createdCategoryEventHandler(
    @Payload() data: CategoryDocument,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.messageQueueService.createdCategoryEventHandler(data);
    await channel.ack(originalMsg);
  }

  @EventPattern(EventPatternType.UPDATED_CATEGORY)
  async updatedCategoryEventHandler(
    @Payload() data: CategoryDocument,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.messageQueueService.updatedCategoryEventHandler(data);
    await channel.ack(originalMsg);
  }
}

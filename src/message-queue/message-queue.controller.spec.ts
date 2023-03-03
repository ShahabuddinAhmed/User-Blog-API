import { Test, TestingModule } from '@nestjs/testing';
import { MessageQueueController } from './message-queue.controller';

describe('MessageQueueController', () => {
  let controller: MessageQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageQueueController],
    }).compile();

    controller = module.get<MessageQueueController>(MessageQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

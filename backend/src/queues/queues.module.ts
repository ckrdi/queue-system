import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { QueuesGateway } from './queues.gateway';

@Module({
  controllers: [QueuesController],
  providers: [QueuesService, QueuesGateway],
})
export class QueuesModule {}

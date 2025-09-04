import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueueType } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('status') status?: string) {
    return await this.queuesService.findAll(status);
  }

  @Post()
  async create(@Body() dto: { type: QueueType }) {
    return await this.queuesService.create(dto.type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':staffId/call')
  async callNext(@Param('staffId') staffId: string) {
    return await this.queuesService.callNext(staffId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/done')
  async done(@Param('id') id: string) {
    return await this.queuesService.done(id);
  }
}

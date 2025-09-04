import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueType, QueueStatus, Queue } from '@prisma/client';

@Injectable()
export class QueuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as QueueStatus } : {};
    return await this.prisma.queue.findMany({ where });
  }

  async create(type: QueueType) {
    const prefix = type === QueueType.Reservation ? 'R' : 'W';
    const last = await this.prisma.queue.findFirst({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
    const num = last ? parseInt(last.queueNo.slice(1)) + 1 : 1;
    const queueNo = `${prefix}${String(num).padStart(3, '0')}`;
    return await this.prisma.queue.create({
      data: { queueNo, type },
    });
  }

  async callNext(staffId: string) {
    const waitingList = await this.prisma.queue.findMany({
      where: { status: QueueStatus.Waiting },
      orderBy: { createdAt: 'asc' },
      take: 3,
    });

    const next = this.selectNext(waitingList);
    if (!next) return null;

    const updated = await this.prisma.queue.update({
      where: { id: next.id },
      data: { status: QueueStatus.Called, calledAt: new Date(), staffId },
    });

    return updated;
  }

  async done(id: string) {
    const updated = await this.prisma.queue.update({
      where: { id: id },
      data: { status: QueueStatus.Done }
    });

    if (updated.staffId) {
      await this.prisma.user.update({
        where: { id: updated.staffId },
        data: { serveNumber: { increment: 1 } },
      });
    }

    return updated;
  }

  private selectNext(list: Queue[]) {
    let r = 0;
    let w = 0;
    for (const q of list) {
      if (q.type === QueueType.Reservation) r++;
      else w++;
      if (r === 2 || (r === 1 && w === 0)) continue;
      if (r >= 2 || (r === 1 && w === 1)) break;
    }
    return list.find((q) => q.type === QueueType.Reservation && r >= 1) || list.find((q) => q.type === QueueType.WalkIn);
  }
}

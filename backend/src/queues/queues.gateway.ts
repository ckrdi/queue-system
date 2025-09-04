import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class QueuesGateway {
  @WebSocketServer()
  server: Server;

  emitQueueCalled(data: any) {
    this.server.emit('queue-called', data);
  }
}

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  BadRequestException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { FileService } from './file.service.js';
import { Response, response } from 'express';

// ПРИ ДОБАВЛЕНИИ АВТОРИЗАЦИИ ВОЗМОЖНО СДЕЛАТЬ СОХРАНИНЕ ЗАПРОСА ВОТ АТК БОЛЬШЕ ДАННЫХ ДЛЯ ПРОВЕРКИ И БЕЗОПАСНОСТИ
// private pendingFiles = new Map<string, Response>();

// interface PendingFile {
//     response: Response;
//     deviceId: string;
//     fileId: string;
// }
// private pendingFiles = new Map<string, PendingFile>();

// const requestId = crypto.randomUUID();

// this.pendingFiles.set(requestId, {
//     response,
//     deviceId,
//     fileId,
// });

@WebSocketGateway({ cors: { origin: '*' } })
export class FileGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  pendingFiles = new Map<string, Response>();

  @WebSocketServer() server: Server;

  constructor(private readonly fileService: FileService) {}

  async requestDeviceDrives() {
    try {
      console.log('requestDeviceDrives');

      const response = await this.server
        .timeout(5000)
        .emitWithAck('requestDeviceDrives');

      return response[0];
    } catch (error) {
      throw new RequestTimeoutException('Клиент не ответил за 5 секунд');
    }
  }

  async getDriveData(path: string) {
    try {
      console.log('getDriveData');

      const response = await this.server
        .timeout(10000)
        .emitWithAck('getDriveData', { path });

      if (!Array.isArray(response[0])) {
        throw new NotFoundException(response[0]);
      }

      return response[0];
    } catch (error) {
      if (error instanceof Error) {
        console.log('catch', error?.message);
      }

      throw new BadRequestException('Не удалось получить данные по этому пути');
    }
  }

  async getFile({
    start,
    end,
    filePath: path,
    requestId,
  }: {
    requestId: string;
    filePath: string[];
    start: number;
    end: number;
  }) {
    await this.server.emit('getFile', {
      requestId,
      path,
      start,
      end,
    });
  }

  async getFileInformation(filePath: string) {
    const response = await this.server
      .timeout(5000)
      .emitWithAck('fileInformation', { filePath });

    return response[0];
  }

  @SubscribeMessage('file-chunk-data')
  handleFileChunk(@MessageBody() data: { requestId: string; chunk: Buffer }) {
    const response = this.pendingFiles.get(data.requestId);

    response?.write(data.chunk);
  }

  @SubscribeMessage('file-chunk-end')
  handleChunkEnd(@MessageBody() data: { requestId: string }) {
    const response = this.pendingFiles.get(data.requestId);

    if (!response) {
      return;
    }

    response.end();

    this.pendingFiles.delete(data.requestId);
  }

  afterInit(server: Server) {
    console.log('connect');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connested: ${client.id}`);
  }

  handleDisconnect(client: Socket, reason?: string | undefined) {
    console.log(`Client disconnected: ${client.id}`);
  }
}

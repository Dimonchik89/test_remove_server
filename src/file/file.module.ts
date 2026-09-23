import { Module } from '@nestjs/common';
import { FileGateway } from './file.gateway.js';
import { FileController } from './file.controller.js';
import { FileService } from './file.service.js';

@Module({
  controllers: [FileController],
  providers: [FileGateway, FileService],
})
export class FileModule {}

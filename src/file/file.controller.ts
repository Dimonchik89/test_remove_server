import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FileGateway } from './file.gateway.js';
import { FileService } from './file.service.js';
import { randomUUID } from 'crypto';
import { GetDriveDataDto } from './dto/get-drive-data.dto.js';
import type { Response } from 'express';
import { analyzePath } from '../utils/analyzePath.js';
import path from 'node:path';
import { mimeTypes } from '../utils/fileType.js';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileGateway: FileGateway,
    private readonly fileService: FileService,
  ) {}

  @Get('local-drive')
  async getLocalDisk() {
    console.log('local-drive');

    return await this.fileGateway.requestDeviceDrives();
  }

  @Post('get-drive-data')
  async getDriveData(@Body() dto: GetDriveDataDto) {
    return this.fileGateway.getDriveData(dto.path);
  }

  @Get('*path')
  async getFile(
    @Param('path') filePath: string[],
    @Res() response: Response,
    @Headers('range') range: string,
  ) {
    const pathNorm = `/${filePath.join('/')}`;
    console.log('pathNorm', pathNorm);

    const { size: totalSize } =
      await this.fileGateway.getFileInformation(pathNorm);
    console.log(totalSize);

    let start = 0;
    let end = totalSize - 1;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      const endPart = parts[1];

      end = endPart ? parseInt(endPart, 10) : start + 1024 * 1024 - 1;

      if (end >= totalSize) {
        end = totalSize - 1;
      }

      if (start >= totalSize || start > end) {
        response.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
        return response.end();
      }

      const chunkSize = end - start + 1;
      response.status(206);
      response.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
      response.setHeader('Accept-Ranges', 'bytes');
      response.setHeader('Content-Length', chunkSize);
    }

    const ext = path.extname(filePath[filePath.length - 1]).toLowerCase();

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    response.setHeader('Content-Type', contentType);

    const requestId = crypto.randomUUID();
    this.fileGateway.pendingFiles.set(requestId, response);

    await this.fileGateway.getFile({ requestId, filePath, start, end });
  }
}

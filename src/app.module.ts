import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FileModule } from './file/file.module.js';

@Module({
  imports: [FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

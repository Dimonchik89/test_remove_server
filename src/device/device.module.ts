import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller.js';
import { DeviceService } from './device.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity.js';
import { User } from '../user/entities/user.entity.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Device, User]), UserModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}

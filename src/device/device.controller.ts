import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeviceService } from './device.service.js';
import { CreateDeviceDto } from './dto/createDevice.dto.js';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() dto: CreateDeviceDto) {
    return this.deviceService.create(dto);
  }

  //   добавить изменение имени девайса
}

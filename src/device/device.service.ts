import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/createDevice.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity.js';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject() private readonly userService: UserService,
  ) {}

  async create({ userId, deviceName, serialNumber }: CreateDeviceDto) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }

    const deviceExists = await this.deviceRepository.findOne({
      where: { serialNumber },
    });

    if (deviceExists) {
      throw new BadRequestException('Device with this ID already exists');
    }

    const device = await this.deviceRepository.create({
      serialNumber,
      deviceName: deviceName || `${user.email}-device-${uuidv4()}`,
      user: {
        id: userId,
      },
    });
    await this.deviceRepository.save(device);
    return device;
  }
}

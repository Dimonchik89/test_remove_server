import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      withDeleted: true,
    });

    return user;
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });

    return user;
  }

  async create({ email, password }: CreateUserDto) {
    const hashedPassword = await argon2.hash(password);

    const user = await this.userRepository.create({
      email,
      hashedPassword,
    });
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
    };
  }

  async setRefreshToken(userId: string, hashedToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hashedRefreshToken = hashedToken;
    await this.userRepository.save(user);
  }

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
      relations: {
        devices: true,
      },
      select: {
        id: true,
        email: true,
        customerId: true,
        subscription: true,
        subscriptionEndDate: true,
        subscriptionCancelScheduledAt: true,
        devices: true,
        subscriptionId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }

    return user;
  }

  getAllUsers() {
    return this.userRepository.findAndCount();
  }

  async deleteUser(id: string) {
    try {
      const user = await this.findById(id);

      if (!user) {
        throw new NotFoundException('User with this ID not found');
      }

      await this.userRepository.softDelete(user.id);
      return { message: `The user ${user.email} was deleted` };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async restoreAccount(id: string) {
    try {
      const user = await this.findById(id);

      if (!user) {
        throw new NotFoundException('User with this ID not found');
      }

      if (!user.deletedAt) {
        throw new BadRequestException(
          'The account does not need to be recovered',
        );
      }

      await this.userRepository.restore(user.id);
      return { message: `User ${user.email} has been restored` };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Something went wrong');
    }
  }
}

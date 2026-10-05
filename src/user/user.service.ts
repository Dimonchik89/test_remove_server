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
    });

    return user;
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
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
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hashedRefreshToken = hashedToken;
    await this.userRepository.save(user);
  }

  getAllUsers() {
    return this.userRepository.findAndCount();
  }
}

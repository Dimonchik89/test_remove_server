import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { CreateUserDto } from '../user/dto/createUser.dto.js';
import { UserService } from '../user/user.service.js';
import * as argon2 from 'argon2';
import { TailUserForToken } from '../types/user.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async register(dto: CreateUserDto) {
    const isUserExist = await this.userService.findByEmail(dto.email);

    if (isUserExist) {
      throw new BadRequestException('The user already exists');
    }

    const newUser = await this.userService.create(dto);
    const tokens = await this.getTokens({
      email: newUser.email,
      id: newUser.id,
    });

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: CreateUserDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await argon2.verify(
      user.hashedPassword,
      dto.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect password');
    }

    const { accessToken, refreshToken } = await this.getTokens({
      id: user.id,
      email: user.email,
    });

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);

    if (user) {
      return {
        id: user.id,
        email: user.email,
      };
    }

    const newUser = await this.userService.create({
      email: googleUser.email,
      password: '',
    });

    return newUser;
  }

  async getTokens(user: TailUserForToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user),
      this.jwtService.signAsync(user, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.getOrThrow<StringValue>('EXPIRES_IN_REFRESH'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await argon2.hash(refreshToken);

    await this.userService.setRefreshToken(userId, hashedToken);
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<TailUserForToken> {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new BadRequestException('Invalid token');
    }

    const isTokenCorrect = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!isTokenCorrect) {
      throw new BadRequestException('Invalid token');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}

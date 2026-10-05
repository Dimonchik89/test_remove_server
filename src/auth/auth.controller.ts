import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { CreateUserDto } from '../user/dto/createUser.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guard/jwt.guard.js';
import type { NextFunction, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from './auth.module.js';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard.js';
import { TailUserForToken } from '../types/user.js';
import { GoogleOAuthGuard } from './guard/google.guard.js';
import passport from 'passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: CreateUserDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async auth(@Req() req: Request) {
    const { accessToken, refreshToken } = await this.authService.getTokens(
      req.user as TailUserForToken,
    );

    const userId = (req?.user as TailUserForToken)?.id;

    await this.authService.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    const user = req.user as TailUserForToken & { platform: string };
    const { accessToken, refreshToken } = await this.authService.getTokens({
      id: user.id,
      email: user.email,
    });
    await this.authService.updateRefreshToken(user.id, refreshToken);

    // настроил в google strayegy чтоб при входе через google и отправле платформы через какую входим как searchParams platform=desktop platform=web мы могла получить это здесь
    console.log(user.platform);

    // доделать, отправлять пару токенов на клиент
    return { message: 'ok' };
  }
}

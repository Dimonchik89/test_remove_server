import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt.guard.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy.js';
import { GoogleStrategy } from './strategies/google.strategy.js';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<StringValue>('EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy, GoogleStrategy],
})
export class AuthModule {}

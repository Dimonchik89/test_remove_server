import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service.js';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    // получяаем из пропрошенного req наш search params с указанием платформы
    let platform = 'web';
    if (req.query.state) {
      try {
        const decoded = JSON.parse(
          Buffer.from(req.query.state as string, 'base64url').toString(),
        );
        platform = decoded?.platform || 'web';
      } catch (error) {}
    }

    const validateUser = await this.authService.validateGoogleUser({
      email: user.email,
      password: '',
    });

    done(null, { ...validateUser, platform });
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }

  // чтоб с searchParams прокинуть в callback информацию от куда запрос, веб или десктоп
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const platform = (req.query?.platform as string) || 'web';

    const state = Buffer.from(JSON.stringify({ platform })).toString(
      'base64url',
    );

    return { state };
  }
}

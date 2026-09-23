import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5434', 'https://dimonchik89.github.io', '*'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Range',
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

// cloudflared tunnel --url http://localhost:3000

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';
import { DevLogger } from './logger/dev.logger';

function createLogger(type: string): LoggerService {
  switch (type) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.useLogger(createLogger(configService.get<string>('LOGGER_TYPE', 'dev')));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();

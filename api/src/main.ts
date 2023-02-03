import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_MAIN_PORT || 3000;
  await app.listen(port);
  logger.log(`App running on port: ${port}`);
}
bootstrap();

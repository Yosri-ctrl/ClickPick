import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransfomeInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransfomeInterceptor());

  const port = process.env.APP_MAIN_PORT || 3000;
  await app.listen(port);
  logger.log(`App running on port: ${port}`);
}
bootstrap();

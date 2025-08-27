import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://85.217.170.47',
      'https://85.217.170.47',
      "http://crm.mindgame.ua",
      "https://crm.mindgame.ua"
    ],
    credentials: true,
  });
  
  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();

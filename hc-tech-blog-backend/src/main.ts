import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS habilitado
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';
  
  await app.listen(port, host);
  (`Application is running on: http://${host}:${port}/api`);
}
bootstrap();

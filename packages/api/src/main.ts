import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Habilitar CORS para permitir solicitudes desde el cliente Next.js
   app.enableCors({
    origin: ['http://localhost:4000'],  // Añade más orígenes si es necesario
    credentials: true,  // Permite el envío de cookies entre dominios
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

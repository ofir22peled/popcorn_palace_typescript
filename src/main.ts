import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Popcorn Palace API')
    .setDescription('API documentation for Popcorn Palace Movie Ticket Booking System')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger is available at: http://localhost:3000/api');
}
bootstrap();
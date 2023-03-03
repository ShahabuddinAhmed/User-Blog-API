import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(LoggerService));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  // const rmqServer = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [process.env.RABBITMQ_URI],
  //       queue: process.env.RABBITMQ_EMAIL_QUEUE,
  //       noAck: false,
  //       prefetchCount: 100, // prefetchCount is depends on server resource that can be server auto scele up
  //       queueOptions: {
  //         durable: true,
  //       },
  //     },
  //   },
  // );
  // await rmqServer.listen();

  const options = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Welcome to Blog API')
    .setVersion('1.0')
    .setTermsOfService('TOS')
    .addTag('Blog')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Blog API is Running on PORT ${PORT}`);
  });
}
bootstrap();

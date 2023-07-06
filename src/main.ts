import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaProducerService } from './kafka.producer';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);

  const kafkaProducerService = app.get(KafkaProducerService);

  // First CSV file
  const topic1 = 'first-topic';
  const filePath1 = path.join(__dirname, '../traffic-repair-update.csv');
  kafkaProducerService.produceData(topic1, filePath1);

  // Second CSV file
  const topic2 = 'second-topic';
  const filePath2 = path.join(__dirname, '../traffic-count.csv');
  kafkaProducerService.produceData(topic2, filePath2);
}

bootstrap();

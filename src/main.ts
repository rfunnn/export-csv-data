import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaProducerService } from './kafka.producer';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);

  const kafkaProducerService = app.get(KafkaProducerService);
  const topic = 'your-topic-name';
  const filePath = path.join(__dirname, '../traffic-signals-1.csv');
  kafkaProducerService.produceData(topic, filePath);
}

bootstrap();

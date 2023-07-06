import { Injectable } from '@nestjs/common';
import * as Kafka from 'kafka-node';

@Injectable()
export class KafkaConsumerService {
  private readonly client: Kafka.KafkaClient;
  private readonly consumer: Kafka.Consumer;

  constructor() {
    this.client = new Kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
    this.consumer = new Kafka.Consumer(this.client, [], {});
  }

  async consumeData(): Promise<void> {
    this.consumer.on('message', (message) => {
      console.log('Consumed data:', message.value);
    });

    this.consumer.on('error', (error) => {
      console.error('Error consuming data:', error);
    });
  }
}

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

  async consumeFirstCsvData(): Promise<void> {
    const topics = [
      {
        topic: 'first-topic',
        partition: 0,
      },
    ];

    this.consumer.addTopics(topics, () => {
      console.log('Consumer ready to consume First CSV data');
    });

    this.consumer.on('message', (message) => {
      console.log('Consumed First CSV data:', message.value);
    });

    this.consumer.on('error', (error) => {
      console.error('Error consuming First CSV data:', error);
    });
  }

  async consumeSecondCsvData(): Promise<void> {
    const topics = [
      {
        topic: 'second-topic',
        partition: 0,
      },
    ];

    this.consumer.addTopics(topics, () => {
      console.log('Consumer ready to consume Second CSV data');
    });

    this.consumer.on('message', (message) => {
      console.log('Consumed Second CSV data:', message.value);
    });

    this.consumer.on('error', (error) => {
      console.error('Error consuming Second CSV data:', error);
    });
  }
}

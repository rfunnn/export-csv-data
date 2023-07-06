import { Injectable } from '@nestjs/common';
import * as Kafka from 'kafka-node';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';

@Injectable()
export class KafkaConsumerService {
  private readonly client: Kafka.KafkaClient;
  private readonly consumer: Kafka.Consumer;

  constructor(
    // eslint-disable-next-line no-unused-vars
    @InjectModel(Record.name) private readonly recordModel: Model<Record>,
  ) {
    this.client = new Kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
    this.consumer = new Kafka.Consumer(this.client, [], {});
  }

  async consumeData(): Promise<void> {
    this.consumer.on('message', async (message: Kafka.Message) => {
      console.log('Consumed data:', message.value.toString());

      try {
        const data = JSON.parse(message.value.toString());
        const { statusDate, mainTask, address, totalCost } =
          data['your-topic-name'];

        const record = new this.recordModel({
          statusDate,
          mainTask,
          address,
          totalCost,
        });

        await record.save();
        console.log('Saved to MongoDB:', record);
      } catch (error) {
        console.error('Error saving to MongoDB:', error);
      }
    });

    this.consumer.on('error', (error) => {
      console.error('Error consuming data:', error);
    });
  }
}

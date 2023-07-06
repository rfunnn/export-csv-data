/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { KafkaClient, Consumer, Message } from 'kafka-node';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from './record.schema';

@Injectable()
export class KafkaConsumerService {
  private readonly client: KafkaClient;
  private readonly consumer: Consumer;

  constructor(
    @InjectModel(Record.name)
    // eslint-disable-next-line no-unused-vars
    private readonly recordModel: Model<RecordDocument>,
  ) {
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.consumer = new Consumer(
      this.client,
      [{ topic: 'first-topic' }, { topic: 'second-topic' }],
      {}
    );
  }

  async consumeData(): Promise<void> {
    this.consumer.on('message', async (message: Message) => {
      console.log('Consumed data:', message.value.toString());

      try {
        const data = JSON.parse(message.value.toString());
        const topicName = message.topic;

        if (topicName === 'first-topic') {
          // Handle previous data format
          const recordDto = {
            statusDate: data['Status Date'],
            mainTask: data['Main Task'],
            address: data['Address'],
            totalCost: data['Total Cost'],
          };

          const record = new this.recordModel(recordDto);
          await record.save();
          console.log('Saved to MongoDB:', record);
        } else if (topicName === 'second-topic') {
          // Handle new data format
          const recordDto = {
            locId: data['loc_id'],
            county: data['county'],
            community: data['community'],
            functionalClass: data['functional_class'],
            ruralUrban: data['rural_urban'],
            on: data['on'],
            from: data['from'],
            to: data['to'],
            approach: data['approach'],
            at: data['at'],
            dir: data['dir'],
            directions: data['directions'],
            category: data['category'],
            lrsId: data['lrs_id'],
            lrsLocPt: data['lrs_loc_pt'],
            latitude: data['latitude'],
            longitude: data['longitude'],
            location: data['location'],
            latest: data['latest'],
            latestDate: data['latest_date'],
          };

          const record = new this.recordModel(recordDto);
          await record.save();
          console.log('Saved to MongoDB:', record);
        } else {
          console.log('Unknown topic:', topicName);
        }
      } catch (error) {
        console.error('Error saving to MongoDB:', error);
      }
    });

    this.consumer.on('error', (error) => {
      console.error('Error consuming data:', error);
    });
  }
}

/* eslint-disable no-unused-vars */
import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Record, RecordDocument } from './record.schema';
import { RecordDto } from './record.dto';

@Injectable()
export class KafkaProducerService {
  private readonly client: KafkaClient;
  private readonly producer: Producer;

  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.producer = new Producer(this.client);
  }

  async produceData(topic: string, filePath: string): Promise<void> {
    const csvData: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => csvData.push(data))
      .on('end', async () => {
        for (const row of csvData) {
          const statusDate = row['Status Date'];
          const mainTask = row['Main Task'];
          const address = row['Address'];
          const totalCost = row['Total Cost'];

          console.log('Status Date:', statusDate);
          console.log('Main Task:', mainTask);
          console.log('Address:', address);
          console.log('Total Cost:', totalCost);
          console.log('\n');

          const payload: ProduceRequest[] = [
            {
              topic,
              messages: JSON.stringify({
                [topic]: {
                  'Status Date': statusDate,
                  'Main Task': mainTask,
                  Address: address,
                  'Total Cost': totalCost,
                },
              }),
            },
          ];

          await new Promise<void>((resolve) => {
            this.producer.send(payload, (error, result) => {
              if (error) {
                console.error('Error producing data:', error);
              } else {
                console.log('Produced data:', result);
                // Save to MongoDB
                const recordDto: RecordDto = {
                  statusDate,
                  mainTask,
                  address,
                  totalCost,
                };
                const record = new this.recordModel(recordDto);
                record
                  .save()
                  .then((savedRecord) => {
                    console.log('Saved to MongoDB:', savedRecord);
                    resolve();
                  })
                  .catch((saveError) => {
                    console.error('Error saving to MongoDB:', saveError);
                    resolve();
                  });
              }
            });
          });

          await new Promise<void>((resolve) => setTimeout(resolve, 5000));
        }
      });
  }
}

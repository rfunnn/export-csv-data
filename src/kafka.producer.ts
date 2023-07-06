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

  async produceData(
    topic: string,
    filePath: string,
    isPreviousData = false,
  ): Promise<void> {
    const csvData: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => csvData.push(data))
      .on('end', async () => {
        for (const row of csvData) {
          let recordDto: RecordDto;

          if (isPreviousData) {
            recordDto = {
              statusDate: row['Status Date'],
              mainTask: row['Main Task'],
              address: row['Address'],
              totalCost: row['Total Cost'],
            };
          } else {
            recordDto = {
              locId: row['loc_id'],
              county: row['county'],
              community: row['community'],
              functionalClass: row['functional_class'],
              ruralUrban: row['rural_urban'],
              on: row['on'],
              from: row['from'],
              to: row['to'],
              approach: row['approach'],
              at: row['at'],
              dir: row['dir'],
              directions: row['directions'],
              category: row['category'],
              lrsId: row['lrs_id'],
              lrsLocPt: row['lrs_loc_pt'],
              latitude: row['latitude'],
              longitude: row['longitude'],
              location: row['location'],
              latest: row['latest'],
              latestDate: row['latest_date'],
            };
          }

          console.log('Record:', recordDto);
          console.log('\n');

          const payload: ProduceRequest[] = [
            {
              topic,
              messages: JSON.stringify({
                [topic]: recordDto,
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

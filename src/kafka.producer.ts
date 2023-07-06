/* eslint-disable no-unused-vars */
import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Record, RecordDocument } from './record.schema';
import { FirstCsvDto, SecondCsvDto } from './record.dto';

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

  async produceFirstCsvData(topic: string, filePath: string): Promise<void> {
    const csvData: FirstCsvDto[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => csvData.push(data))
      .on('end', async () => {
        for (const row of csvData) {
          const recordDto: FirstCsvDto = {
            statusDate: row['Status Date'],
            mainTask: row['Main Task'],
            address: row['Address'],
            totalCost: row['Total Cost'],
          };

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

  async produceSecondCsvData(topic: string, filePath: string): Promise<void> {
    const csvData: SecondCsvDto[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => csvData.push(data))
      .on('end', async () => {
        for (const row of csvData) {
          const recordDto: SecondCsvDto = {
            locId: row['Loc Id'],
            county: row['County'],
            community: row['Community'],
            functionalClass: row['Functional Class'],
            ruralUrban: row['Rural Urban'],
            on: row['On'],
            from: row['From'],
            to: row['To'],
            approach: row['Approach'],
            at: row['At'],
            dir: row['Dir'],
            directions: row['Directions'],
            category: row['Category'],
            lrsId: row['Lrs Id'],
            lrsLocPt: row['Lrs Loc Pt'],
            latitude: row['Latitude'],
            longitude: row['Longitude'],
            location: row['Location'],
            latest: row['Latest'],
            latestDate: row['Latest Date'],
          };

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

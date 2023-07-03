import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class KafkaProducerService {
  private readonly client: KafkaClient;
  private readonly producer: Producer;

  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.producer = new Producer(this.client);
  }

  async produceData(topic: string, filePath: string): Promise<void> {
    const csvData: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => csvData.push(data))
      .on('end', () => {
        let i = 0;
        const interval = setInterval(() => {
          if (i >= csvData.length) {
            clearInterval(interval);
            return;
          }

          const row = csvData[i];
          const statusDate = row['Status Date'];
          const mainTask = row['Main Task'];
          const address = row['Address'];
          const totalCost = row['Total Cost'];

          console.log('Status Date:', statusDate);
          console.log('Main Task:', mainTask);
          console.log('Address:', address);
          console.log('Total Cost:', totalCost);
          console.log('\n ');

          const payload: ProduceRequest[] = [
            {
              topic,
              messages: JSON.stringify({
                [topic]: {
                  'Status Date': statusDate,
                  'Main Task': mainTask,
                  // eslint-disable-next-line prettier/prettier
                  'Address': address,
                  'Total Cost': totalCost,
                },
              }),
            },
          ];

          this.producer.send(payload, (error, result) => {
            if (error) {
              console.error('Error producing data:', error);
            } else {
              console.log('Produced data:', result);
            }
          });

          i++;
        }, 5000);
      });
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaProducerService } from './kafka.producer';
import { KafkaConsumerService } from './kafka.consumer';
import { Record, RecordSchema } from './record.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://arfan:1234@cluster0.gwemtwt.mongodb.net/csvTry?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
})
export class AppModule {}

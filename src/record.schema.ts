import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema()
export class Record {
  @Prop({ required: true })
  statusDate: string;

  @Prop({ required: true })
  mainTask: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  totalCost: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);

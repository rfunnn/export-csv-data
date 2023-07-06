import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema()
export class Record {
  //first csv schema
  @Prop({ required: true })
  statusDate: string;

  @Prop({ required: true })
  mainTask: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  totalCost: string;

  //second csv schema
  @Prop({ required: true })
  locId: string;

  @Prop({ required: true })
  county: string;

  @Prop({ required: true })
  community: string;

  @Prop({ required: true })
  functionalClass: string;

  @Prop({ required: true })
  ruralUrban: string;

  @Prop({ required: true })
  on: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  approach: string;

  @Prop({ required: true })
  at: string;

  @Prop({ required: true })
  dir: string;

  @Prop({ required: true })
  directions: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  lrsId: string;

  @Prop({ required: true })
  lrsLocPt: string;

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  latest: string;

  @Prop({ required: true })
  latestDate: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);

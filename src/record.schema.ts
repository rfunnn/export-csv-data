import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record {
  // First CSV file schema
  @Prop()
  statusDate?: string;

  @Prop()
  mainTask?: string;

  @Prop()
  address?: string;

  @Prop()
  totalCost?: string;

  // Second CSV file schema
  @Prop()
  locId?: string;

  @Prop()
  county?: string;

  @Prop()
  community?: string;

  @Prop()
  functionalClass?: string;

  @Prop()
  ruralUrban?: string;

  @Prop()
  on?: string;

  @Prop()
  from?: string;

  @Prop()
  to?: string;

  @Prop()
  approach?: string;

  @Prop()
  at?: string;

  @Prop()
  dir?: string;

  @Prop()
  directions?: string;

  @Prop()
  category?: string;

  @Prop()
  lrsId?: string;

  @Prop()
  lrsLocPt?: string;

  @Prop()
  latitude?: string;

  @Prop()
  longitude?: string;

  @Prop()
  location?: string;

  @Prop()
  latest?: string;

  @Prop()
  latestDate?: string;
}

export type RecordDocument = Record & Document;

export const RecordSchema = SchemaFactory.createForClass(Record);

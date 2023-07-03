import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop()
  data: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);

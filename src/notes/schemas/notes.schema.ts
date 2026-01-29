import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({
    type: Types.ObjectId,
    ref: 'Lead',
    required: true,
    index: true,
  })
  leadId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

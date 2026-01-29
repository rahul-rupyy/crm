import { LeadSource, LeadStatus } from '@/common/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: LeadSource, default: LeadSource.MANUAL })
  source: string;

  @Prop({ required: true, enum: LeadStatus, default: LeadStatus.NEW })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

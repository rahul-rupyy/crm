import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './schemas/notes.schema';
import { createNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private NoteModel: Model<NoteDocument>,
  ) {}

  async create(leadId: string, dto: createNoteDto, userId: string) {
    return this.NoteModel.create({
      leadId: new Types.ObjectId(leadId),
      text: dto.text,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async findByLead(leadId: string) {
    return this.NoteModel.find({ leadId: new Types.ObjectId(leadId) })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }
}

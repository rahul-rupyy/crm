import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, HydratedDocument } from 'mongoose';
import { Note, NoteDocument } from './schemas/notes.schema';
import { createNoteDto } from './dto/notes.dto';
import { User } from '../users/schemas/user.schema';

type UserDocument = HydratedDocument<User>;
@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private NoteModel: Model<NoteDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(leadId: string, dto: createNoteDto, userId: string) {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) {
      throw new NotFoundException('User (createdBy) not found');
    }
    return this.NoteModel.create({
      leadId: new Types.ObjectId(leadId),
      text: dto.text,
      createdBy: new Types.ObjectId(userId),
    });
  }

  findByLead(leadId: string) {
    return this.NoteModel.find({ leadId: new Types.ObjectId(leadId) })
      .populate('createdBy', 'name')
      .sort({ createdAt: 1 });
  }
}

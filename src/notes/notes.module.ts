import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note, NoteSchema } from './schemas/notes.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}

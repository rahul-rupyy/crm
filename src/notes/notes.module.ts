import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note, NoteSchema } from './schemas/notes.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}

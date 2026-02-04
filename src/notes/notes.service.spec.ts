import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { Note } from './schemas/notes.schema';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: {
            new: () => ({ save: () => ({}) }),
            constructor: () => ({ save: () => ({}) }),
            find: () => ({
              sort: () => ({ populate: () => ({ exec: () => [] }) }),
            }),
            create: () => ({}),
            save: () => ({}),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).to.not.equal(undefined);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { expect } from 'chai';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).to.not.equal(undefined);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { expect } from 'chai';
import { getModelToken } from '@nestjs/mongoose';
import { Lead } from './schemas/lead.schemas';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,

        {
          provide: getModelToken(Lead.name),
          useValue: {
            new: () => ({ save: () => ({}) }),
            constructor: () => ({ save: () => ({}) }),
            find: () => ({ exec: () => [] }),
            create: () => ({}),
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).to.not.equal(undefined);
  });
});

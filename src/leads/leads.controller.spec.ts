import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { expect } from 'chai';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { NotesService } from '@/notes/notes.service';
import { JwtUser } from '@/common/types';

describe('LeadsController', () => {
  let controller: LeadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        {
          provide: LeadsService,
          useValue: {
            create: () => ({}),
            findAll: () => [],
            findOne: () => ({}),
            update: () => ({}),
            remove: () => ({}),
            getDashboardMetrics: () => ({}),
          },
        },
        {
          provide: NotesService,
          useValue: {
            create: () => ({}),
            findByLead: () => [],
          },
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
  });

  it('should be defined', () => {
    expect(controller).to.not.equal(undefined);
  });

  it('should create a lead', () => {
    const dto = {} as CreateLeadDto;

    const mockUser: JwtUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'user',
    };

    expect(controller.create(dto, mockUser)).to.not.equal(undefined);
  });

  it('should update a lead', () => {
    const dto = {} as UpdateLeadDto;
    expect(controller.update('1', dto)).to.not.equal(undefined);
  });
});

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schemas';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@/common/types';
import { faker } from '@faker-js/faker';
@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) {}

  async seed() {
    const leads: Partial<Lead>[] = [];

    for (let i = 0; i < 50; i++) {
      leads.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.string.numeric(10),
        source: faker.helpers.arrayElement([
          'website',
          'referral',
          'ad',
          'manual',
        ]),
        status: 'new',
        assignedTo: new Types.ObjectId('507f1f77bcf86cd799439011'),
        createdBy: new Types.ObjectId('507f1f77bcf86cd799439011'),
      });
    }

    return this.leadModel.insertMany(leads);
  }
  async create(createLeadDto: CreateLeadDto, userId: string): Promise<Lead> {
    const newLead = new this.leadModel({
      ...createLeadDto,
      createdBy: new Types.ObjectId(userId),
      assignedTo: new Types.ObjectId(createLeadDto.assignedTo),
    });
    return newLead.save();
  }

  async findAll(): Promise<Lead[]> {
    return this.leadModel.find().exec();
  }

  async findOne(id: string): Promise<Lead> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Lead ID');
    }

    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException(`Lead #${id} not found`);
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    if (updateLeadDto.status) {
      await this.checkStatusTransition(id, updateLeadDto.status);
    }

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();

    if (!updatedLead) throw new NotFoundException(`Lead #${id} not found`);
    return updatedLead;
  }

  async remove(id: string): Promise<Lead> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) throw new NotFoundException(`Lead #${id} not found`);
    return deletedLead;
  }

  private async checkStatusTransition(
    id: string,
    newStatus: LeadStatus,
  ): Promise<void> {
    const lead = await this.findOne(id);
    const currentStatus = lead.status as LeadStatus;

    const validTransitions: Record<LeadStatus, LeadStatus[]> = {
      [LeadStatus.NEW]: [LeadStatus.NEW, LeadStatus.CONTACTED],
      [LeadStatus.CONTACTED]: [LeadStatus.CONTACTED, LeadStatus.INTERESTED],
      [LeadStatus.INTERESTED]: [LeadStatus.INTERESTED, LeadStatus.CONVERTED],
      [LeadStatus.CONVERTED]: [LeadStatus.CONVERTED],
    };

    const allowed = validTransitions[currentStatus];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition. You cannot go from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.join(', ')}`,
      );
    }
  }
}

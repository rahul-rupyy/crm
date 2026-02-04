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
import { FindLeadsQueryDto } from './dto/find-leads-query.dto';
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

  async findAll(query: FindLeadsQueryDto) {
    const mongoQuery: Record<string, any> = {};

    // Filter by status (comma separated string to array)
    if (query.status) {
      mongoQuery.status = { $in: query.status.split(',') };
    }

    // Filter by source
    if (query.source) {
      mongoQuery.source = { $in: query.source.split(',') };
    }

    // Filter by assignedTo (Crucial: Convert string to ObjectId)
    if (query.assignedTo && Types.ObjectId.isValid(query.assignedTo)) {
      mongoQuery.assignedTo = new Types.ObjectId(query.assignedTo);
    }

    // Search Logic
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      mongoQuery.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    return this.leadModel.find(mongoQuery).sort({ createdAt: -1 }).exec();
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

  async getDashboardMetrics() {
    const [totalLeads, convertedLeads, assignedLeads, statusAggregation] =
      await Promise.all([
        this.leadModel.countDocuments(),
        this.leadModel.countDocuments({ status: LeadStatus.CONVERTED }),
        this.leadModel.countDocuments({
          assignedTo: { $exists: true, $ne: null },
        }),
        this.leadModel.aggregate<{ _id: LeadStatus | null; count: number }>([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    const leadsByStatus: Record<LeadStatus, number> = {
      [LeadStatus.NEW]: 0,
      [LeadStatus.CONTACTED]: 0,
      [LeadStatus.INTERESTED]: 0,
      [LeadStatus.CONVERTED]: 0,
    };

    for (const item of statusAggregation) {
      if (item._id && Object.values(LeadStatus).includes(item._id)) {
        leadsByStatus[item._id] = item.count;
      }
    }

    return { totalLeads, leadsByStatus, assignedLeads, convertedLeads };
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
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}

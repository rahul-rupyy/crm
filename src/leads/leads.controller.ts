import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { FindLeadsQueryDto } from './dto/find-leads-query.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { createNoteDto } from '@/notes/dto/notes.dto';
import { NotesService } from '@/notes/notes.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@/auth/roles.enum';
import { type JwtUser } from '@/common/types';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly notesService: NotesService,
  ) {}

  // --- LEADS ROUTES ---

  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: JwtUser) {
    return this.leadsService.create(createLeadDto, user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  // --- NOTES ROUTES (Nested) ---

  @Post(':id/notes')
  createNote(
    @Param('id') leadId: string,
    @Body() dto: createNoteDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.notesService.create(leadId, dto, user.userId);
  }

  @Get(':id/notes')
  findNote(@Param('id') leadId: string) {
    return this.notesService.findByLead(leadId);
  }

  // dashboard call
  @Get('dashboard')
  getDashboardMetrics() {
    return this.leadsService.getDashboardMetrics();
  }
  // filter
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: FindLeadsQueryDto,
  ) {
    return this.leadsService.findAll(query);
  }
}

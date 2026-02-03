import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Headers,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { FindLeadsQueryDto } from './dto/find-leads-query.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { createNoteDto } from '@/notes/dto/notes.dto';
import { NotesService } from '@/notes/notes.service';
import type { RequestWithUser } from '@/types/notes/note';
import { AuthGuard } from '@nestjs/passport';
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly notesService: NotesService,
  ) {}

  @Post()
  create(
    @Body() createLeadDto: CreateLeadDto,
    @Headers('x-user-id') userId: string = '507f1f77bcf86cd799439011',
  ) {
    return this.leadsService.create(createLeadDto, userId);
  }

  // @Get()
  // findAll() {
  //   return this.leadsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
  //Notes Routes

  @Post(':id/notes')
  @UseGuards(AuthGuard('jwt'))
  createNote(
    @Param('id') leadId: string,
    @Body() dto: createNoteDto,
    @Req() req: RequestWithUser,
  ) {
    const uid = req.user.sub;
    return this.notesService.create(leadId, dto, uid);
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

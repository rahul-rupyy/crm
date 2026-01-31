import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class createNoteDto {
  @IsMongoId()
  @IsOptional()
  leadId: string;

  @IsString()
  text: string;
}

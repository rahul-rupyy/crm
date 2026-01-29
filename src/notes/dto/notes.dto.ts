import { IsMongoId, IsString } from 'class-validator';

export class createNoteDto {
  @IsMongoId()
  leadId: string;

  @IsString()
  text: string;
}

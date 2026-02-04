import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FindLeadsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString() // Add this to allow the limit parameter
  limit?: string;
}

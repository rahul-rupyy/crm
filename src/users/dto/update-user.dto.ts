import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Allow password change via a separate endpoint ideally; kept here for simplicity
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

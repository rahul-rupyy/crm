import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  secretKey?: string;

  // Allow frontend alias 'adminSecretKey' as well
  @IsOptional()
  @IsString()
  adminSecretKey?: string;
}

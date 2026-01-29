import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { User } from '@/users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
type AuthTokenResponse = {
  access_token: string;
  user: { id: object; email: string; name: string; role: Role };
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.validateUser(email, password);
    const payload = { sub: user._id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async signup(
    name: string,
    email: string,
    password: string,
    secretKey?: string,
  ): Promise<AuthTokenResponse> {
    // Determine role based on provided secret and env value
    let role = Role.User;
    if (
      secretKey &&
      secretKey === this.configService.get<string>('ADMIN_SECRET_KEY')
    ) {
      role = Role.Admin;
    }
    // Persist user with resolved role
    const created = await this.usersService.create({
      name,
      email,
      password,
      role,
    });
    const payload = {
      sub: created._id,
      email: created.email,
      role: role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      user: {
        id: created._id,
        email: created.email,
        name: created.name,
        role: role,
      },
    };
  }
}

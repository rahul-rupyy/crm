import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private toView(u: User) {
    return { id: u._id, name: u.name, email: u.email, role: u.role };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  create(
    @Body() dto: CreateUserDto,
  ): Promise<{ id: object; name: string; email: string; role: Role }> {
    return this.usersService.create(dto).then((u) => this.toView(u));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  findAll(): Promise<
    Array<{ id: object; name: string; email: string; role: Role }>
  > {
    return this.usersService
      .findAll()
      .then((users) => users.map((u) => this.toView(u)));
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(
    @Req() req: Request & { user: { sub: string } },
  ): Promise<{ id: object; name: string; email: string; role: Role } | null> {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) return null;
    return this.toView(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<{ id: object; name: string; email: string; role: Role }> {
    return this.usersService.update(id, dto).then((u) => this.toView(u));
  }
}

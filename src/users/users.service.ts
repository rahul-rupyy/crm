import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { authMessages } from '@/types/auth/auth';
// Role type not needed in this service after controller mapping

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (exists) throw new ConflictException(authMessages.EMAIL_ALREADY_EXISTS);
    const passwordHash = await hash(dto.password, 10);
    const created = new this.userModel({
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash,
      role: dto.role ?? 'user',
    });
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(authMessages.USER_NOT_FOUND);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.password) user.passwordHash = await hash(dto.password, 10);
    await user.save();
    return user;
  }
}

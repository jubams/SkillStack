import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<FindUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { projects: true, goals: true, skills: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return plainToInstance(FindUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<FindUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = this.userRepository.merge(user, dto);
    const savedUser = this.userRepository.save(updatedUser);

    return plainToInstance(FindUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;

    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }

  async updateEmail(userId: number, dto: UpdateEmailDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const emailExists = await this.userRepository.findOne({
      where: { email: dto.newEmail },
    });

    if (emailExists) {
      throw new BadRequestException('Email already in use');
    }

    user.email = dto.newEmail;
    this.userRepository.save(user);
    
    return { message: 'Email updated successfully' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.remove(user);
    return { message: 'User deleted', id };
  }
}

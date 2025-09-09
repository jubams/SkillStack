import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDTO: CreateUserDto) {

    if(userDTO.password !== userDTO.confirmPassword){
      throw new BadRequestException('password and confirm password are not the same')
    }

    const { confirmPassword, ...userData } = userDTO;
    
    const existing = await this.userRepository.findOne({
      where: { email: userDTO.email },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(userDTO.password, 10);
    const newUser = this.userRepository.create({
      ...userDTO,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async login(loginUserDto: LoginUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!existing) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      existing.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: existing.id, email: existing.email };

    const token = await this.jwtService.signAsync(payload);
  
    const { password, ...userWithoutPassword } = existing;

    return {
      accessToken: token,
      user: userWithoutPassword,
    };
  }
}

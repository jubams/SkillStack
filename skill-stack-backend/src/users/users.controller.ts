import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@User('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  updateMe(@User('userId') userId: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }

  @Patch('me/password')
  updatePassword(
    @User('userId') userId: number,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(userId, dto);
  }

  @Patch('me/email')
  updateEmail(@User('userId') userId: number, @Body() dto: UpdateEmailDto) {
    return this.usersService.updateEmail(userId, dto);
  }

  @Delete('me')
  removeMe(@User('userId') userId: number) {
    return this.usersService.remove(userId);
  }
}

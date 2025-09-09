import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(
    @Body() createSkillDto: CreateSkillDto,
    @User('userId') userId: number,
  ) {
    return this.skillsService.create(createSkillDto, userId);
  }

  @Get()
  findAll(@User('userId') userId: number) {
    return this.skillsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') userId: number,
  ) {
    return this.skillsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto,
    @User('userId') userId: number,
  ) {
    return this.skillsService.update(id, updateSkillDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') userId: number,
  ) {
    return this.skillsService.remove(id, userId);
  }
}

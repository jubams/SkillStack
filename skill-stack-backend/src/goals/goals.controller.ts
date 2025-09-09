import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() createGoalDto: CreateGoalDto,@User('userId') userId: number,) {
    return this.goalsService.create(createGoalDto,userId);
  }

  @Get()
  findAll(@User('userId') userId: number,) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('userId') userId: number,) {
    return this.goalsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @User('userId') userId: number,) {
    return this.goalsService.update(+id, updateGoalDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('userId') userId: number,) {
    return this.goalsService.remove(+id, userId);
  }
}

import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), TypeOrmModule.forFeature([Skill]),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Project])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}

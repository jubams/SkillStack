import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Project])],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}

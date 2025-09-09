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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @User('userId') userId: number,
  ) {
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  findAll(@User('userId') userId: number) {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('userId') userId: number) {
    return this.projectsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User('userId') userId: number,
  ) {
    return this.projectsService.update(+id, updateProjectDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('userId') userId: number) {
    return this.projectsService.remove(+id, userId);
  }
}

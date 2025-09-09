import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from './entities/project.entity';
import { ILike, In, Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const { skillIds = [], projectTitle, ...rest } = createProjectDto;

    const existing = await this.projectRepository.findOne({
      where: { projectTitle: ILike(projectTitle), user: { id: userId } },
    });

    if (existing) throw new BadRequestException("Project's name already used");

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let skills: Skill[] = [];
    if (skillIds.length) {
      skills = await this.skillRepository.findBy({ id: In(skillIds) });
      if (skills.length !== skillIds.length) {
        const foundIds = new Set(skills.map((s) => s.id));
        const missing = skillIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(`Skills not found: ${missing.join(', ')}`);
      }
    }

    const newProject = this.projectRepository.create({
      ...rest,
      projectTitle,
      user,
      skills,
    });

    const savedProject = await this.projectRepository.save(newProject);

    const projectWithRelations = await this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: { skills: true },
    });

    return projectWithRelations;
  }

  async findAll(userId: number) {
    return await this.projectRepository.find({
      where: { user: { id: userId } },
      relations: { skills: true },
    });
  }

  async findOne(projectId: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        user: { id: userId },
      },
      relations: { skills: true },
    });

    if (!project)
      throw new NotFoundException(
        `Project ${projectId} not found or access denied`,
      );

    return project;
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ) {
    const existProject = await this.findOne(projectId, userId);
    if (!existProject)
      throw new NotFoundException(`Project not found or access denied`);

    const updatedProject = this.projectRepository.merge(
      existProject,
      updateProjectDto,
    );
    return this.projectRepository.save(updatedProject);
  }

  async remove(projectId: number, userId: number) {
    const existProject = await this.findOne(projectId, userId);
    if (!existProject) {
      throw new NotFoundException(`Project not found or access denied`);
    }

    await this.projectRepository.remove(existProject);

    return { message: 'Deleted successfully', projectId };
  }
}

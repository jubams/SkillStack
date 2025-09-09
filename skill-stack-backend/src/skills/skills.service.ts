import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createSkillDto: CreateSkillDto, userId: number) {
    const { skillName, projectIds, ...rest } = createSkillDto;

    const existing = await this.skillRepository.findOne({
      where: { skillName: ILike(skillName) , user:{id:userId} },
    });

    if (existing) throw new BadRequestException('Skill already exists');

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let projects: Project[] = [];
    if (projectIds?.length) {
      projects = await this.projectRepository.findBy({ id: In(projectIds) });
    }

    const newSkill = this.skillRepository.create({
      ...rest,
      skillName,
      user,
      projects,
    });

    const savedSkill = await this.skillRepository.save(newSkill);
    const { user: _user, ...skillWithoutUser } = savedSkill;
    return skillWithoutUser;
  }

  async findAll(userId: number) {
    return await this.skillRepository.find({
      where: { user: { id: userId } },
      relations: { projects: true },
    });
  }

  async findOne(skillId: number, userId: number) {
    const skill = await this.skillRepository.findOne({
      where: {
        id: skillId,
        user: { id: userId },
      },
      relations: { projects: true },
    });
    if (!skill) {
      throw new NotFoundException(
        `Skill ${skillId} not found or access denied`,
      );
    }

    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto, userId: number) {
    const existSkill = await this.findOne(id, userId);

    if (!existSkill) {
      throw new NotFoundException(`Skill not found or access denied`);
    }
    const updatedSkill = this.skillRepository.merge(existSkill, updateSkillDto);
    return this.skillRepository.save(updatedSkill);
  }

  async remove(id: number, userId: number) {
    const existSkill = await this.findOne(id, userId);
    if (!existSkill) {
      throw new NotFoundException(`Skill not found or access denied`);
    }

    await this.skillRepository.remove(existSkill);
    return { message: 'Deleted successfully', id };
  }
}

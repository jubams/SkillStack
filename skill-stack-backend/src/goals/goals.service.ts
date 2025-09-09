import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { ILike, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Goal) private readonly goalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto, userId: number) {
    const { skillIds = [], goalTitle, ...rest } = createGoalDto;

    const existing = await this.goalRepository.findOne({
      where: { goalTitle: ILike(goalTitle), user:{id:userId}  },
    });

    if (existing) throw new BadRequestException("Goal's name already used");

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

    const newGoal = await this.goalRepository.create({
      ...rest,
      goalTitle,
      user,
      skills,
    });

    const savedGoal = await this.goalRepository.save(newGoal);
    const goalWithRelations = await this.goalRepository.findOne({
      where: { id: savedGoal.id },
      relations: { skills: true },
    });

    return goalWithRelations;
  }

  async findAll(userId: number) {
    return await this.goalRepository.find({
      where: { user: { id: userId } },
      relations: { skills: true },
    });
  }

  async findOne(goalId: number, userId: number) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId, user: { id: userId } },
      relations: { skills: true },
    });

    if (!goal) {
      throw new NotFoundException(
        `Goal ${goalId} not found or access denied`,
      );
    }

    return goal;
  }

  async update(goalId: number, updateGoalDto: UpdateGoalDto, userId: number) {
    const existGoal = await this.findOne(goalId, userId);

    if (!existGoal)
      throw new NotFoundException(`Goal not found or access denied`);

    const updatedGoal = this.goalRepository.merge(existGoal, updateGoalDto);

    return this.goalRepository.save(updatedGoal);
  }

  async remove(goalId: number, userId: number) {
    const existGoal = await this.findOne(goalId, userId);

    if (!existGoal)
      throw new NotFoundException(`Goal not found or access denied`);

    await this.goalRepository.remove(existGoal);

    return { message: 'Deleted successfully', goalId };
  }
}

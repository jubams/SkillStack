import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { ProficiencyLevel } from 'src/common/enums/shared.enums';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillName: string;

  @Column({ type: 'text' })
  proficiencyLevel: ProficiencyLevel;

  @Column()
  skillCategory: string;

  @Column({ type: 'text', nullable: true })
  skillDescription: string;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE', eager: false })
  user: User;

  @ManyToMany(() => Project, (project) => project.skills)
  projects: Project[];
}

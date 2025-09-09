import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { Status } from 'src/common/enums/shared.enums';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectTitle: string;

  @Column({ type: 'text', nullable: true })
  projectDescription?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'text', nullable: true })
  projectGithubURL?: string;

  @Column({ type: 'text', nullable: true })
  projectLiveURL?: string;

  @Column({ type: 'simple-enum', enum: Status })
  projectStatus: Status;

  @Column({ type: 'date', nullable: true })
  projectStartedDate?: Date;

  @Column({ type: 'date', nullable: true })
  projectFinishedDate?: Date;

  @ManyToOne(() => User, (user) => user.projects, { 
    onDelete: 'CASCADE',
    eager: false,   // don’t auto-load
  })
  user: User;
  

  @ManyToMany(() => Skill, (skill) => skill.projects, { cascade: true })
  @JoinTable()
  skills: Skill[];
}

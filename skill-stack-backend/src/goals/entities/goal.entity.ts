import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Status, Priority, TimeLine } from 'src/common/enums/shared.enums';
import { Skill } from 'src/skills/entities/skill.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  goalTitle: string;

  @Column({ type: 'text', nullable: true })
  goalDescription: string;

  @Column({ type: 'simple-enum', enum: Status }) // Completed/InProgress/NotStarted
  goalStatus: Status;

  @Column({ type: 'simple-enum', enum: Priority })
  goalPriority: Priority;

  @Column({ type: 'simple-enum', enum: TimeLine })
  goalTimeLine: TimeLine;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column()
  category: string;

  @Column({ default: 0 })
  progress: number;

  @Column({ type: 'text', nullable: true })
  goalNote: string;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
  
  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  user: User;
}

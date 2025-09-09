import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Project } from 'src/projects/entities/project.entity';
  import { Goal } from 'src/goals/entities/goal.entity';
  import { Skill } from 'src/skills/entities/skill.entity';

  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ nullable: true })
    jobTitle: string;
  
    @Column({ nullable: true })
    profileImage: string;
  
    @Column({ type: 'text', nullable: true })
    userBio: string;
  
    @Column('simple-json', { nullable: true })
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      portfolio?: string;
    };
  
    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];
  
    @OneToMany(() => Goal, (goal) => goal.user)
    goals: Goal[];
  
    @OneToMany(() => Skill, (skill) => skill.user)
    skills: Skill[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { SkillsService } from '../../services/skills.service';
import { GoalsService } from '../../services/goals.service';
import { Project } from '../../models/interfaces/project.model';
import { Skill } from '../../models/interfaces/skill.model';
import { Goal } from '../../models/interfaces/goal.model';
import { Status, Priority } from '../../models/shared.enums';

interface DashboardStats {
  totalProjects: number;
  skillsTracked: number;
  activeGoals: number;
}

interface SkillOverview {
  skillName: string;
  skillCategory: string;
  proficiencyLevel: string;
  progress: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  stats: DashboardStats = {
    totalProjects: 0,
    skillsTracked: 0,
    activeGoals: 0
  };

  skillsOverview: SkillOverview[] = [];
  upcomingGoals: Goal[] = [];
  recentProjects: Project[] = [];

  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private goalsService: GoalsService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;

    Promise.all([
      this.loadProjects(),
      this.loadSkills(),
      this.loadGoals()
    ]).then(() => {
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Failed to load dashboard data';
      console.error('Dashboard loading error:', error);
    });
  }

  private loadProjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.projectsService.findAll().subscribe({
        next: (projects) => {
          this.recentProjects = projects.slice(0, 3); // Get 3 most recent
          this.stats.totalProjects = projects.length;
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private loadSkills(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.skillsService.findAll().subscribe({
        next: (skills) => {
          this.stats.skillsTracked = skills.length;
          this.skillsOverview = this.mapSkillsToOverview(skills.slice(0, 4)); // Get top 4 skills
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private loadGoals(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.goalsService.findAll().subscribe({
        next: (goals) => {
          const activeGoals = goals.filter(goal =>
            goal.goalStatus === Status.InProgress || goal.goalStatus === Status.NotStarted
          );
          this.stats.activeGoals = activeGoals.length;

          // Get upcoming goals (sorted by due date)
          this.upcomingGoals = activeGoals
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 3);

          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private mapSkillsToOverview(skills: Skill[]): SkillOverview[] {
    return skills.map(skill => ({
      skillName: skill.skillName,
      skillCategory: skill.skillCategory,
      proficiencyLevel: skill.proficiencyLevel,
      progress: this.getProficiencyProgress(skill.proficiencyLevel)
    }));
  }

  private getProficiencyProgress(level: string): number {
    switch (level) {
      case 'Beginner': return 20;
      case 'Novice': return 40;
      case 'Intermediate': return 60;
      case 'Advanced': return 80;
      case 'Expert': return 100;
      default: return 0;
    }
  }

  getProjectStatusColor(status: string): string {
    switch (status) {
      case Status.Completed: return 'bg-green-100 text-green-800';
      case Status.InProgress: return 'bg-blue-100 text-blue-800';
      case Status.NotStarted: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getGoalPriorityColor(priority: string): string {
    switch (priority) {
      case Priority.High: return 'text-red-600';
      case Priority.Medium: return 'text-yellow-600';
      case Priority.Low: return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  getGoalStatusText(status: string): string {
    switch (status) {
      case Status.InProgress: return 'In Progress';
      case Status.NotStarted: return 'Not Started';
      case Status.Completed: return 'Completed';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}

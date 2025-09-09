import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { GoalsService } from '../../services/goals.service';
import { SkillsService } from '../../services/skills.service';
import { Goal } from '../../models/interfaces/goal.model';
import { Skill } from '../../models/interfaces/skill.model';
import { CreateGoalForm, UpdateGoalForm } from '../../models/forms/goal.form';
import { CreateGoalDto } from '../../models/requests/createGoalDto';
import { UpdateGoalDto } from '../../models/requests/updateGoalDto';
import { Priority, Status, TimeLine } from '../../models/shared.enums';
import { getAllGoalCategories } from '../../shared/constants/categories.constants';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  goal?: Goal;
}

@Component({
  selector: 'app-goals',
  standalone: false,
  templateUrl: './goals.html',
  styleUrl: './goals.scss'
})
export class Goals implements OnInit, OnDestroy {
  allGoals: Goal[] = [];
  filteredGoals: Goal[] = [];
  categories: string[] = [];
  availableSkills: Skill[] = [];

  // Expose Math for template use
  Math = Math;

  // Filter states
  selectedCategory: string = 'All Categories';
  selectedStatus: string = 'All Statuses';
  selectedPriority: string = 'All Priorities';
  searchTerm: string = '';

  // Modal states
  modal: ModalState = { isOpen: false, mode: 'create' };
  goalForm: FormGroup;
  selectedSkillIds: number[] = [];

  // Loading and error states
  isLoading = true;
  isFormLoading = false;
  hasError = false;
  errorMessage = '';

  // Toast notification properties
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  // Enums for dropdowns
  priorities = Object.values(Priority);
  statuses = Object.values(Status);
  timelines = Object.values(TimeLine);

  constructor(
    private goalsService: GoalsService,
    private skillsService: SkillsService,
    private formBuilder: RxFormBuilder
  ) {
    // Initialize form with empty model
    const model = new CreateGoalForm();
    this.goalForm = this.formBuilder.formGroup(model);
  }

  ngOnInit(): void {
    this.loadGoals();
    this.loadSkills();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  private loadGoals(): void {
    this.isLoading = true;
    this.hasError = false;

    this.goalsService.findAll().subscribe({
      next: (goals) => {
        this.allGoals = goals;
        this.filteredGoals = goals;
        this.extractCategories();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load goals';
        console.error('Goals loading error:', error);
      }
    });
  }

  private loadSkills(): void {
    this.skillsService.findAll().subscribe({
      next: (skills) => {
        this.availableSkills = skills;
      },
      error: (error) => {
        console.error('Skills loading error:', error);
      }
    });
  }

  private extractCategories(): void {
    // Use the shared constants for consistent categories
    this.categories = getAllGoalCategories().slice(1); // Remove 'All Categories' for internal use
  }

  // Filter methods
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredGoals = this.allGoals.filter(goal => {
      // Category filter
      const categoryMatch = this.selectedCategory === 'All Categories' ||
        goal.category === this.selectedCategory;

      // Status filter
      const statusMatch = this.selectedStatus === 'All Statuses' ||
        goal.goalStatus === this.selectedStatus;

      // Priority filter
      const priorityMatch = this.selectedPriority === 'All Priorities' ||
        goal.goalPriority === this.selectedPriority;

      // Search filter
      const searchMatch = !this.searchTerm ||
        goal.goalTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        goal.goalDescription?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return categoryMatch && statusMatch && priorityMatch && searchMatch;
    });
  }

  // Modal methods
  openCreateModal(): void {
    this.modal = { isOpen: true, mode: 'create' };
    this.goalForm = this.formBuilder.formGroup(new CreateGoalForm());
    this.selectedSkillIds = [];
  }

  openEditModal(goal: Goal): void {
    this.modal = { isOpen: true, mode: 'edit', goal };
    const editModel = new UpdateGoalForm({
      goalTitle: goal.goalTitle,
      goalDescription: goal.goalDescription,
      goalStatus: goal.goalStatus,
      goalPriority: goal.goalPriority,
      goalTimeLine: goal.goalTimeLine,
      startDate: this.formatDateForInput(goal.startDate),
      dueDate: this.formatDateForInput(goal.dueDate),
      category: goal.category,
      progress: goal.progress,
      goalNote: goal.goalNote,
      skillIds: goal.skills?.map(s => s.id) || []
    });
    this.goalForm = this.formBuilder.formGroup(editModel);
    this.selectedSkillIds = goal.skills?.map(s => s.id) || [];
  }

  openDeleteModal(goal: Goal): void {
    this.modal = { isOpen: true, mode: 'delete', goal };
    // For delete, populate form with goal data but make it readonly
    const deleteModel = new CreateGoalForm({
      goalTitle: goal.goalTitle,
      goalDescription: goal.goalDescription,
      goalStatus: goal.goalStatus,
      goalPriority: goal.goalPriority,
      goalTimeLine: goal.goalTimeLine,
      startDate: this.formatDateForInput(goal.startDate),
      dueDate: this.formatDateForInput(goal.dueDate),
      category: goal.category,
      progress: goal.progress,
      goalNote: goal.goalNote,
      skillIds: goal.skills?.map(s => s.id) || []
    });
    this.goalForm = this.formBuilder.formGroup(deleteModel);
    this.selectedSkillIds = goal.skills?.map(s => s.id) || [];
    // Disable all form controls for delete mode
    this.goalForm.disable();
  }

  closeModal(): void {
    this.modal = { isOpen: false, mode: 'create' };
    this.goalForm.reset();
    this.selectedSkillIds = [];
    this.goalForm.enable(); // Re-enable in case it was disabled
  }

  // Form submission methods
  onSubmit(): void {
    if (this.modal.mode === 'delete') {
      this.deleteGoal();
      return;
    }

    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    if (this.modal.mode === 'create') {
      this.createGoal();
    } else if (this.modal.mode === 'edit') {
      this.updateGoal();
    }
  }

  private createGoal(): void {
    this.isFormLoading = true;
    const formValue = this.goalForm.value as CreateGoalForm;

    const goalData: CreateGoalDto = {
      goalTitle: formValue.goalTitle,
      goalDescription: formValue.goalDescription,
      goalStatus: formValue.goalStatus,
      goalPriority: formValue.goalPriority,
      goalTimeLine: formValue.goalTimeLine,
      startDate: formValue.startDate,
      dueDate: formValue.dueDate,
      category: formValue.category,
      progress: formValue.progress,
      goalNote: formValue.goalNote,
      skillIds: this.selectedSkillIds
    };

    this.goalsService.create(goalData).subscribe({
      next: (response) => {
        this.isFormLoading = false;
        this.showToastMessage('Goal created successfully!', 'success');
        this.closeModal();
        this.loadGoals();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to create goal. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  private updateGoal(): void {
    if (!this.modal.goal) return;

    this.isFormLoading = true;
    const formValue = this.goalForm.value as UpdateGoalForm;

    const goalData: UpdateGoalDto = {
      goalTitle: formValue.goalTitle,
      goalDescription: formValue.goalDescription,
      goalStatus: formValue.goalStatus,
      goalPriority: formValue.goalPriority,
      goalTimeLine: formValue.goalTimeLine,
      startDate: formValue.startDate,
      dueDate: formValue.dueDate,
      category: formValue.category,
      progress: formValue.progress,
      goalNote: formValue.goalNote,
      skillIds: this.selectedSkillIds
    };

    this.goalsService.update(this.modal.goal.id, goalData).subscribe({
      next: (response) => {
        this.isFormLoading = false;
        this.showToastMessage('Goal updated successfully!', 'success');
        this.closeModal();
        this.loadGoals();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to update goal. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  private deleteGoal(): void {
    if (!this.modal.goal) return;

    this.isFormLoading = true;

    this.goalsService.remove(this.modal.goal.id).subscribe({
      next: () => {
        this.isFormLoading = false;
        this.showToastMessage('Goal deleted successfully!', 'success');
        this.closeModal();
        this.loadGoals();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to delete goal. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  onSkillChange(skillId: number, event: any): void {
    if (event.target.checked) {
      this.selectedSkillIds.push(skillId);
    } else {
      this.selectedSkillIds = this.selectedSkillIds.filter(id => id !== skillId);
    }
  }

  isSkillSelected(skillId: number): boolean {
    return this.selectedSkillIds.includes(skillId);
  }

  hasFormError(controlName: string, errorKey?: string): boolean {
    const control = this.goalForm.get(controlName);
    if (!control) return false;
    if (errorKey) return !!control.errors?.[errorKey] && (control.dirty || control.touched);
    return !!control.errors && (control.dirty || control.touched);
  }

  firstError(controlName: string): string | null {
    const control = this.goalForm.get(controlName);
    if (!control || !control.errors) return null;
    const firstKey = Object.keys(control.errors)[0];
    const err = control.errors[firstKey];
    return typeof err === 'string' ? err : err?.message || firstKey;
  }

  // Goal-specific utility methods
  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.High: return 'bg-red-500';
      case Priority.Medium: return 'bg-yellow-500';
      case Priority.Low: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusColor(status: Status): string {
    switch (status) {
      case Status.Completed: return 'bg-green-500';
      case Status.InProgress: return 'bg-blue-500';
      case Status.NotStarted: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getDaysRemaining(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(dueDate: string): boolean {
    return this.getDaysRemaining(dueDate) < 0;
  }

  getSkillCount(goal: Goal): number {
    return goal.skills?.length || 0;
  }

  // Toast notification methods
  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    const duration = type === 'success' ? 5000 : 8000;
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast(): void {
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  // Utility methods
  refreshGoals(): void {
    this.loadGoals();
  }

  clearFilters(): void {
    this.selectedCategory = 'All Categories';
    this.selectedStatus = 'All Statuses';
    this.selectedPriority = 'All Priorities';
    this.searchTerm = '';
    this.applyFilters();
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    // If the date is already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Convert date to YYYY-MM-DD format for HTML date input
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

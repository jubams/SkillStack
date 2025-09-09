import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { SkillsService } from '../../services/skills.service';
import { ProjectsService } from '../../services/projects.service';
import { Skill } from '../../models/interfaces/skill.model';
import { Project } from '../../models/interfaces/project.model';
import { CreateSkillForm, UpdateSkillForm } from '../../models/forms/skill.form';
import { CreateSkillDto } from '../../models/requests/createSkillDto';
import { UpdateSkillDto } from '../../models/requests/updateSkillDto';
import { ProficiencyLevel } from '../../models/shared.enums';
import { getAllSkillCategories } from '../../shared/constants/categories.constants';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  skill?: Skill;
}

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills implements OnInit, OnDestroy {
  allSkills: Skill[] = [];
  filteredSkills: Skill[] = [];
  categories: string[] = [];
  availableProjects: Project[] = [];

  // Filter states
  selectedCategory: string = 'All Categories';
  selectedLevel: string = 'All Levels';
  searchTerm: string = '';

  // Modal states
  modal: ModalState = { isOpen: false, mode: 'create' };
  skillForm: FormGroup;
  selectedProjectIds: number[] = [];

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
  proficiencyLevels = Object.values(ProficiencyLevel);

  constructor(
    private skillsService: SkillsService,
    private projectsService: ProjectsService,
    private formBuilder: RxFormBuilder
  ) {
    // Initialize form with empty model
    const model = new CreateSkillForm();
    this.skillForm = this.formBuilder.formGroup(model);
  }

  ngOnInit(): void {
    this.loadSkills();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  private loadSkills(): void {
    this.isLoading = true;
    this.hasError = false;

    this.skillsService.findAll().subscribe({
      next: (skills) => {
        this.allSkills = skills;
        this.filteredSkills = skills;
        this.extractCategories();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load skills';
        console.error('Skills loading error:', error);
      }
    });
  }

  private loadProjects(): void {
    this.projectsService.findAll().subscribe({
      next: (projects) => {
        this.availableProjects = projects;
      },
      error: (error) => {
        console.error('Projects loading error:', error);
      }
    });
  }

  private extractCategories(): void {
    // Use the shared constants for consistent categories
    this.categories = getAllSkillCategories().slice(1); // Remove 'All Categories' for internal use
  }

  // Filter methods
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onLevelChange(level: string): void {
    this.selectedLevel = level;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredSkills = this.allSkills.filter(skill => {
      // Category filter
      const categoryMatch = this.selectedCategory === 'All Categories' ||
        skill.skillCategory === this.selectedCategory;

      // Level filter
      const levelMatch = this.selectedLevel === 'All Levels' ||
        skill.proficiencyLevel === this.selectedLevel;

      // Search filter
      const searchMatch = !this.searchTerm ||
        skill.skillName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        skill.skillDescription?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return categoryMatch && levelMatch && searchMatch;
    });
  }

  // Modal methods
  openCreateModal(): void {
    this.modal = { isOpen: true, mode: 'create' };
    this.skillForm = this.formBuilder.formGroup(new CreateSkillForm());
    this.selectedProjectIds = [];
  }

  openEditModal(skill: Skill): void {
    this.modal = { isOpen: true, mode: 'edit', skill };
    const editModel = new UpdateSkillForm({
      skillName: skill.skillName,
      proficiencyLevel: skill.proficiencyLevel,
      skillCategory: skill.skillCategory,
      skillDescription: skill.skillDescription,
      yearsOfExperience: skill.yearsOfExperience,
      projectIds: skill.projects?.map(p => p.id) || []
    });
    this.skillForm = this.formBuilder.formGroup(editModel);
    this.selectedProjectIds = skill.projects?.map(p => p.id) || [];
  }

  openDeleteModal(skill: Skill): void {
    this.modal = { isOpen: true, mode: 'delete', skill };
    // For delete, populate form with skill data but make it readonly
    const deleteModel = new CreateSkillForm({
      skillName: skill.skillName,
      proficiencyLevel: skill.proficiencyLevel,
      skillCategory: skill.skillCategory,
      skillDescription: skill.skillDescription,
      yearsOfExperience: skill.yearsOfExperience,
      projectIds: skill.projects?.map(p => p.id) || []
    });
    this.skillForm = this.formBuilder.formGroup(deleteModel);
    this.selectedProjectIds = skill.projects?.map(p => p.id) || [];
    // Disable all form controls for delete mode
    this.skillForm.disable();
  }

  closeModal(): void {
    this.modal = { isOpen: false, mode: 'create' };
    this.skillForm.reset();
    this.selectedProjectIds = [];
    this.skillForm.enable(); // Re-enable in case it was disabled
  }

  // Form submission methods
  onSubmit(): void {
    if (this.modal.mode === 'delete') {
      this.deleteSkill();
      return;
    }

    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    if (this.modal.mode === 'create') {
      this.createSkill();
    } else if (this.modal.mode === 'edit') {
      this.updateSkill();
    }
  }

  private createSkill(): void {
    this.isFormLoading = true;
    const formValue = this.skillForm.value as CreateSkillForm;

    const skillData: CreateSkillDto = {
      skillName: formValue.skillName,
      proficiencyLevel: formValue.proficiencyLevel,
      skillCategory: formValue.skillCategory,
      skillDescription: formValue.skillDescription,
      yearsOfExperience: formValue.yearsOfExperience,
      projectIds: this.selectedProjectIds
    };

    this.skillsService.create(skillData).subscribe({
      next: (response) => {
        this.isFormLoading = false;
        this.showToastMessage('Skill created successfully!', 'success');
        this.closeModal();
        this.loadSkills();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to create skill. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  private updateSkill(): void {
    if (!this.modal.skill) return;

    this.isFormLoading = true;
    const formValue = this.skillForm.value as UpdateSkillForm;

    const skillData: UpdateSkillDto = {
      skillName: formValue.skillName,
      proficiencyLevel: formValue.proficiencyLevel,
      skillCategory: formValue.skillCategory,
      skillDescription: formValue.skillDescription,
      yearsOfExperience: formValue.yearsOfExperience,
      projectIds: this.selectedProjectIds
    };

    this.skillsService.update(this.modal.skill.id, skillData).subscribe({
      next: (response) => {
        this.isFormLoading = false;
        this.showToastMessage('Skill updated successfully!', 'success');
        this.closeModal();
        this.loadSkills();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to update skill. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  private deleteSkill(): void {
    if (!this.modal.skill) return;

    this.isFormLoading = true;

    this.skillsService.remove(this.modal.skill.id).subscribe({
      next: () => {
        this.isFormLoading = false;
        this.showToastMessage('Skill deleted successfully!', 'success');
        this.closeModal();
        this.loadSkills();
      },
      error: (error) => {
        this.isFormLoading = false;
        const errorMsg = error.message || 'Failed to delete skill. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }


  onProjectChange(projectId: number, event: any): void {
    if (event.target.checked) {
      this.selectedProjectIds.push(projectId);
    } else {
      this.selectedProjectIds = this.selectedProjectIds.filter(id => id !== projectId);
    }
  }

  isProjectSelected(projectId: number): boolean {
    return this.selectedProjectIds.includes(projectId);
  }


  hasFormError(controlName: string, errorKey?: string): boolean {
    const control = this.skillForm.get(controlName);
    if (!control) return false;
    if (errorKey) return !!control.errors?.[errorKey] && (control.dirty || control.touched);
    return !!control.errors && (control.dirty || control.touched);
  }

  firstError(controlName: string): string | null {
    const control = this.skillForm.get(controlName);
    if (!control || !control.errors) return null;
    const firstKey = Object.keys(control.errors)[0];
    const err = control.errors[firstKey];
    return typeof err === 'string' ? err : err?.message || firstKey;
  }


  getProficiencyProgress(level: ProficiencyLevel): number {
    switch (level) {
      case ProficiencyLevel.Beginner: return 20;
      case ProficiencyLevel.Novice: return 40;
      case ProficiencyLevel.Intermediate: return 60;
      case ProficiencyLevel.Advanced: return 80;
      case ProficiencyLevel.Expert: return 100;
      default: return 0;
    }
  }

  getProficiencyColor(level: ProficiencyLevel): string {
    switch (level) {
      case ProficiencyLevel.Beginner: return 'bg-red-500';
      case ProficiencyLevel.Novice: return 'bg-orange-500';
      case ProficiencyLevel.Intermediate: return 'bg-yellow-500';
      case ProficiencyLevel.Advanced: return 'bg-blue-500';
      case ProficiencyLevel.Expert: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  getProjectCount(skill: Skill): number {
    return skill.projects?.length || 0;
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
  refreshSkills(): void {
    this.loadSkills();
  }

  clearFilters(): void {
    this.selectedCategory = 'All Categories';
    this.selectedLevel = 'All Levels';
    this.searchTerm = '';
    this.applyFilters();
  }
}

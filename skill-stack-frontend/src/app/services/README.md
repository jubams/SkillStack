# Frontend Services Implementation Guide

## Overview

This guide shows how to implement and use the Projects, Skills, and Goals services in the frontend, following the same patterns used in the login/register components.

## Services Created

Three services have been created following the backend API structure:

- `ProjectsService` (`/app/services/projects.service.ts`)
- `SkillsService` (`/app/services/skills.service.ts`) 
- `GoalsService` (`/app/services/goals.service.ts`)

Each service provides full CRUD operations:
- `create(dto)` - Create new entity
- `findAll()` - Get all entities for current user
- `findOne(id)` - Get specific entity by ID
- `update(id, dto)` - Update entity
- `remove(id)` - Delete entity

## Form Models Created

Form validation models have been created using the same `@rxweb/reactive-form-validators` pattern:

- `CreateProjectForm` & `UpdateProjectForm` (`/app/models/forms/project.form.ts`)
- `CreateSkillForm` & `UpdateSkillForm` (`/app/models/forms/skill.form.ts`)
- `CreateGoalForm` & `UpdateGoalForm` (`/app/models/forms/goal.form.ts`)

## Usage Examples

### 1. Basic Service Usage

```typescript
import { ProjectsService, SkillsService, GoalsService } from '../services';

constructor(
  private projectsService: ProjectsService,
  private skillsService: SkillsService,
  private goalsService: GoalsService
) {}

// Get all projects
this.projectsService.findAll().subscribe({
  next: (projects) => {
    console.log('Projects:', projects);
  },
  error: (error) => {
    console.error('Error:', error.message);
  }
});

// Create a new project
const projectData: CreateProjectDto = {
  projectTitle: 'My New Project',
  projectDescription: 'A great project',
  projectStatus: Status.InProgress,
  skillIds: [1, 2, 3]
};

this.projectsService.create(projectData).subscribe({
  next: (project) => {
    console.log('Created:', project);
  },
  error: (error) => {
    console.error('Error:', error.message);
  }
});
```

### 2. Form Component Implementation

Here's how to create a component for adding projects following the login/register pattern:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectForm } from '../models/forms/project.form';
import { CreateProjectDto } from '../models/requests/createProjectDto';
import { Status } from '../models/shared.enums';

@Component({
  selector: 'app-create-project',
  standalone: false,
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss'
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  projectForm: FormGroup;
  isLoading = false;
  statusEnum = Status;

  // Toast notification properties (same pattern as login/register)
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(
    private formBuilder: RxFormBuilder,
    private projectsService: ProjectsService
  ) {
    const model = new CreateProjectForm();
    this.projectForm = this.formBuilder.formGroup(model);
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.projectForm.value as CreateProjectForm;

    const projectData: CreateProjectDto = {
      projectTitle: formValue.projectTitle,
      projectDescription: formValue.projectDescription,
      projectStatus: formValue.projectStatus,
      projectGithubURL: formValue.projectGithubURL,
      projectLiveURL: formValue.projectLiveURL,
      projectStartedDate: formValue.projectStartedDate,
      projectFinishedDate: formValue.projectFinishedDate,
      skillIds: formValue.skillIds
    };

    this.projectsService.create(projectData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showToastMessage('Project created successfully!', 'success');
        this.projectForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.message || 'Failed to create project. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  // Helper methods (same as login/register)
  hasError(controlName: string, errorKey?: string): boolean {
    const control = this.projectForm.get(controlName);
    if (!control) return false;
    if (errorKey) return !!control.errors?.[errorKey] && (control.dirty || control.touched);
    return !!control.errors && (control.dirty || control.touched);
  }

  firstError(controlName: string): string | null {
    const control = this.projectForm.get(controlName);
    if (!control || !control.errors) return null;
    const firstKey = Object.keys(control.errors)[0];
    const err = control.errors[firstKey];
    return typeof err === 'string' ? err : err?.message || firstKey;
  }

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
}
```

### 3. HTML Template Example

```html
<div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
  <!-- Toast Notification (copy from login.html) -->
  <div *ngIf="showToast"
    class="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out"
    [class]="showToast ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'">
    <!-- Toast content same as login/register -->
  </div>

  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Create New Project</h2>
    <p class="text-gray-600">Add a new project to your portfolio</p>
  </div>

  <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-6">
    <!-- Project Title -->
    <div>
      <label for="projectTitle" class="block text-sm font-medium text-gray-700 mb-1">
        Project Title *
      </label>
      <input type="text" id="projectTitle" formControlName="projectTitle" 
        placeholder="Enter project title"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
        [class.border-red-300]="hasError('projectTitle')"
        [class.focus:ring-red-500]="hasError('projectTitle')" />
      <div *ngIf="hasError('projectTitle')" class="mt-1 text-xs text-red-600">
        {{ firstError('projectTitle') }}
      </div>
    </div>

    <!-- Project Status -->
    <div>
      <label for="projectStatus" class="block text-sm font-medium text-gray-700 mb-1">
        Status *
      </label>
      <select id="projectStatus" formControlName="projectStatus"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200">
        <option value="">Select status</option>
        <option [value]="statusEnum.NotStarted">Not Started</option>
        <option [value]="statusEnum.InProgress">In Progress</option>
        <option [value]="statusEnum.Completed">Completed</option>
      </select>
    </div>

    <!-- Submit Button (same style as login/register) -->
    <button type="submit"
      class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
      [disabled]="isLoading || projectForm.invalid">
      <span *ngIf="!isLoading">Create Project</span>
      <span *ngIf="isLoading">Creating...</span>
    </button>
  </form>
</div>
```

## Available Enums

The following enums from `shared.enums.ts` are available for dropdowns:

```typescript
// For Skills
ProficiencyLevel: Beginner, Novice, Intermediate, Advanced, Expert

// For Projects and Goals
Status: Completed, InProgress, NotStarted

// For Goals
Priority: Low, Medium, High
TimeLine: ShortTerm, MedTerm, LongTerm
```

## Loading Related Data

To populate dropdowns with related entities (e.g., skills for projects):

```typescript
ngOnInit(): void {
  this.loadAvailableSkills();
}

private loadAvailableSkills(): void {
  this.skillsService.findAll().subscribe({
    next: (skills) => {
      this.availableSkills = skills;
    },
    error: (error) => {
      console.error('Failed to load skills:', error);
    }
  });
}
```

## Authentication

All services automatically include the JWT token via the `TokenInterceptor`, so no additional authentication handling is needed in the service calls.

## Error Handling

Each service has comprehensive error handling that provides user-friendly error messages for different HTTP status codes:

- 400: Bad request
- 401: Unauthorized access
- 403: Access forbidden
- 404: Entity not found
- 409: Entity already exists
- 500: Internal server error

## Module Integration

Make sure to add the new components to your Angular module's `declarations` array and import any required modules (FormsModule, ReactiveFormsModule, CommonModule) in your feature modules.

## Key Points

1. **Follow the same pattern as login/register** for form handling, validation, and toast notifications
2. **Use RxFormBuilder** with validation model classes
3. **Handle loading states** and show appropriate feedback
4. **Use consistent styling** with Tailwind classes matching the existing design
5. **Implement proper error handling** with user-friendly messages
6. **Include toast notifications** for success/error feedback

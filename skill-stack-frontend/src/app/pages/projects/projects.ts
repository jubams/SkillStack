import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { SkillsService } from '../../services/skills.service';
import { Project } from '../../models/interfaces/project.model';
import { Skill } from '../../models/interfaces/skill.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from '../../models/shared.enums';
import { CreateProjectDto } from '../../models/requests/createProjectDto';
import { UpdateProjectDto } from '../../models/requests/updateProjectDto';

interface DeleteModalState { isOpen: boolean; project?: Project; }
interface ProjectModalState { isOpen: boolean; mode: 'create' | 'edit'; project?: Project | null; }

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit, OnDestroy {
  projects: Project[] = [];
  skills: Skill[] = [];
  filteredProjects: Project[] = [];
  searchTerm = '';
  statusFilter = 'All Status';
  skillFilter = 'All Skills';
  isLoading = false;
  statusFilterOptions = ['All Status', 'Completed', 'In Progress', 'Not Started'];
  deleteModal: DeleteModalState = { isOpen: false };
  projectModal: ProjectModalState = { isOpen: false, mode: 'create', project: null };
  projectForm!: FormGroup;
  selectedSkillIds: number[] = [];
  selectedImageFile: File | null = null;
  isFormLoading = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(private projectsService: ProjectsService, private skillsService: SkillsService, private fb: FormBuilder) { }

  get completedProjectsCount(): number { return this.projects.filter(p => p.projectStatus === 'Completed').length; }
  get inProgressProjectsCount(): number { return this.projects.filter(p => p.projectStatus === 'In Progress').length; }
  get notStartedProjectsCount(): number { return this.projects.filter(p => p.projectStatus === 'Not Started').length; }

  ngOnInit() { this.initProjectForm(); this.loadProjects(); this.loadSkills(); }
  ngOnDestroy(): void { if (this.toastTimeout) clearTimeout(this.toastTimeout); }

  loadProjects() {
    this.isLoading = true;
    this.projectsService.findAll().subscribe({
      next: (projects) => { this.projects = projects; this.applyFilters(); this.isLoading = false; },
      error: (error) => { console.error('Error loading projects:', error); this.isLoading = false; }
    });
  }

  loadSkills() {
    this.skillsService.findAll().subscribe({
      next: (skills) => { this.skills = skills; },
      error: (error) => { console.error('Error loading skills:', error); }
    });
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.projectTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) || (project.projectDescription?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchesStatus = this.statusFilter === 'All Status' || project.projectStatus === this.statusFilter;
      const matchesSkill = this.skillFilter === 'All Skills' || (project.skills?.some(skill => skill.skillName === this.skillFilter) ?? false);
      return matchesSearch && matchesStatus && matchesSkill;
    });
  }

  onSearchChange() { this.applyFilters(); }
  onStatusFilterChange() { this.applyFilters(); }
  onSkillFilterChange() { this.applyFilters(); }

  openDeleteModal(project: Project): void { this.deleteModal = { isOpen: true, project }; }
  closeDeleteModal(): void { this.deleteModal = { isOpen: false }; }

  confirmDelete(): void {
    if (!this.deleteModal.project) return;
    this.isFormLoading = true;
    this.projectsService.remove(this.deleteModal.project.id).subscribe({
      next: () => { this.isFormLoading = false; this.showToastMessage('Project deleted successfully!', 'success'); this.closeDeleteModal(); this.loadProjects(); },
      error: (error) => { this.isFormLoading = false; this.showToastMessage(error.message || 'Failed to delete project.', 'error'); }
    });
  }

  formatDate(dateString: string | undefined): string { if (!dateString) return 'Not set'; return new Date(dateString).toLocaleDateString(); }
  clearFilters(): void { this.searchTerm = ''; this.statusFilter = 'All Status'; this.skillFilter = 'All Skills'; this.applyFilters(); }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message; this.toastType = type; this.showToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.hideToast(), type === 'success' ? 5000 : 8000);
  }
  hideToast(): void { this.showToast = false; if (this.toastTimeout) clearTimeout(this.toastTimeout); }

  private initProjectForm(project?: Project) {
    this.projectForm = this.fb.group({
      projectTitle: [project?.projectTitle || '', [Validators.required]],
      projectDescription: [project?.projectDescription || ''],
      thumbnail: [project?.thumbnail || ''], // will store the relative path string
      projectGithubURL: [project?.projectGithubURL || ''],
      projectLiveURL: [project?.projectLiveURL || ''],
      projectStatus: [project?.projectStatus || Status.NotStarted, [Validators.required]],
      projectStartedDate: [project?.projectStartedDate || ''],
      projectFinishedDate: [project?.projectFinishedDate || '']
    });
    this.selectedSkillIds = project?.skills?.map(s => s.id) || [];
  }

  openCreateProjectModal(): void {
    this.projectModal = { isOpen: true, mode: 'create', project: null };
    this.initProjectForm();
    this.selectedImageFile = null;
  }

  openEditProjectModal(project: Project): void {
    this.projectModal = { isOpen: true, mode: 'edit', project };
    this.initProjectForm(project);
    this.selectedImageFile = null;
  }

  closeProjectModal(): void {
    this.projectModal.isOpen = false;
  }

  onProjectSkillToggle(skillId: number): void {
    if (this.selectedSkillIds.includes(skillId)) {
      this.selectedSkillIds = this.selectedSkillIds.filter(id => id !== skillId);
    } else {
      this.selectedSkillIds.push(skillId);
    }
  }

  onProjectImageSelected(file: File): void {
    // In lieu of upload, create a local path under assets/projects
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const relativePath = `/assets/images/projects/${Date.now()}_${sanitizedName}`; // simulate saved path
    this.projectForm.patchValue({ thumbnail: relativePath });
    this.selectedImageFile = file;
    // NOTE: Actual copying of file to public assets would require build tooling / user action outside of Angular runtime.
  }

  submitProjectForm(): void {
    if (this.projectForm.invalid) { this.projectForm.markAllAsTouched(); return; }
    this.isFormLoading = true;
    const basePayload: CreateProjectDto | UpdateProjectDto = {
      ...this.projectForm.value,
      skillIds: this.selectedSkillIds
    };

    if (this.projectModal.mode === 'create') {
      this.projectsService.create(basePayload as CreateProjectDto).subscribe({
        next: () => { this.isFormLoading = false; this.showToastMessage('Project created successfully!', 'success'); this.closeProjectModal(); this.loadProjects(); },
        error: (err) => { this.isFormLoading = false; this.showToastMessage(err.message || 'Failed to create project', 'error'); }
      });
    } else if (this.projectModal.mode === 'edit' && this.projectModal.project) {
      this.projectsService.update(this.projectModal.project.id, basePayload as UpdateProjectDto).subscribe({
        next: () => { this.isFormLoading = false; this.showToastMessage('Project updated successfully!', 'success'); this.closeProjectModal(); this.loadProjects(); },
        error: (err) => { this.isFormLoading = false; this.showToastMessage(err.message || 'Failed to update project', 'error'); }
      });
    }
  }
}

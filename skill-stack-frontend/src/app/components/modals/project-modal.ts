import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Project } from '../../models/interfaces/project.model';
import { Skill } from '../../models/interfaces/skill.model';

@Component({
  selector: 'app-project-modal',
  standalone: false,
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.scss'
})
export class ProjectModal {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() project?: Project | null;
  @Input() projectForm!: FormGroup; // should contain fields matching Create/Update DTO
  @Input() isFormLoading = false;
  @Input() availableSkills: Skill[] = [];
  @Input() selectedSkillIds: number[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() skillToggle = new EventEmitter<number>();
  @Output() imageSelected = new EventEmitter<File>();

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onClose(): void { this.closeModal.emit(); }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.submitForm.emit();
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  toggleSkill(skillId: number): void {
    this.skillToggle.emit(skillId);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB.');
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview = reader.result; };
    reader.readAsDataURL(file);
    this.imageSelected.emit(file);
  }

  resetImageState(): void { this.imagePreview = null; this.selectedFile = null; }

  hasFormError(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}

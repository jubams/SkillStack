import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../models/interfaces/project.model';

@Component({
  selector: 'app-delete-project-modal',
  standalone: false,
  templateUrl: './delete-project-modal.html',
  styleUrl: './delete-project-modal.scss'
})
export class DeleteProjectModal {
  @Input() isOpen = false;
  @Input() project: Project | null | undefined = null;
  @Input() isLoading = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirmDelete(): void {
    this.confirmDelete.emit();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }
}

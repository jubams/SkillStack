import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Skill } from '../../models/interfaces/skill.model';

@Component({
    selector: 'app-delete-skill-modal',
    standalone: false,
    templateUrl: './delete-skill-modal.html',
    styleUrl: './delete-skill-modal.scss'
})
export class DeleteSkillModal {
    @Input() isOpen = false;
    @Input() skill?: Skill;
    @Input() isLoading = false;

    @Output() closeModal = new EventEmitter<void>();
    @Output() confirmDelete = new EventEmitter<void>();

    onClose(): void {
        this.closeModal.emit();
    }

    onConfirm(): void {
        this.confirmDelete.emit();
    }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Goal } from '../../models/interfaces/goal.model';

@Component({
    selector: 'app-delete-goal-modal',
    standalone: false,
    templateUrl: './delete-goal-modal.html',
    styleUrl: './delete-goal-modal.scss'
})
export class DeleteGoalModal {
    @Input() isOpen = false;
    @Input() goal?: Goal;
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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Goal } from '../../models/interfaces/goal.model';
import { GOAL_CATEGORIES } from '../../shared/constants/categories.constants';

@Component({
    selector: 'app-goal-modal',
    standalone: false,
    templateUrl: './goal-modal.html',
    styleUrl: './goal-modal.scss'
})
export class GoalModal {
    @Input() isOpen = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() goal?: Goal;
    @Input() goalForm!: FormGroup;
    @Input() isFormLoading = false;

    @Output() closeModal = new EventEmitter<void>();
    @Output() submitForm = new EventEmitter<void>();

    // Expose constants to template
    goalCategories = GOAL_CATEGORIES;

    onClose(): void {
        this.closeModal.emit();
    }

    onSubmit(): void {
        if (this.goalForm.valid) {
            this.submitForm.emit();
        }
    }

    hasFormError(fieldName: string): boolean {
        const field = this.goalForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}

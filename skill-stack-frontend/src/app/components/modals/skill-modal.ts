import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Skill } from '../../models/interfaces/skill.model';
import { SKILL_CATEGORIES } from '../../shared/constants/categories.constants';

@Component({
    selector: 'app-skill-modal',
    standalone: false,
    templateUrl: './skill-modal.html',
    styleUrl: './skill-modal.scss'
})
export class SkillModal implements OnInit {
    @Input() isOpen = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() skill?: Skill;
    @Input() skillForm!: FormGroup;
    @Input() isFormLoading = false;

    @Output() closeModal = new EventEmitter<void>();
    @Output() submitForm = new EventEmitter<void>();

    // Expose constants to template
    skillCategories = SKILL_CATEGORIES;

    ngOnInit(): void { }

    onClose(): void {
        this.closeModal.emit();
    }

    onSubmit(): void {
        this.submitForm.emit();
    }

    hasFormError(fieldName: string): boolean {
        const field = this.skillForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}

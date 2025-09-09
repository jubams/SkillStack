import {
    required,
    numeric,
    minNumber,
    prop
} from '@rxweb/reactive-form-validators';
import { ProficiencyLevel } from '../shared.enums';

export class CreateSkillForm {
    @required({ message: 'Skill name is required' })
    skillName: string;

    @required({ message: 'Proficiency level is required' })
    proficiencyLevel: ProficiencyLevel;

    @required({ message: 'Skill category is required' })
    skillCategory: string;

    @prop()
    skillDescription?: string;

    @numeric({ message: 'Years of experience must be a number' })
    @minNumber({ value: 0, message: 'Years of experience cannot be negative' })
    yearsOfExperience?: number;

    @prop()
    projectIds?: number[];

    constructor(skill?: CreateSkillForm) {
        this.skillName = skill?.skillName || '';
        this.proficiencyLevel = skill?.proficiencyLevel || ProficiencyLevel.Beginner;
        this.skillCategory = skill?.skillCategory || '';
        this.skillDescription = skill?.skillDescription || '';
        this.yearsOfExperience = skill?.yearsOfExperience || 0;
        this.projectIds = skill?.projectIds || [];
    }
}

export class UpdateSkillForm extends CreateSkillForm {
    constructor(skill?: UpdateSkillForm) {
        super(skill);
    }
}

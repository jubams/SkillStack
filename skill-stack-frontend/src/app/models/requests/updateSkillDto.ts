import { ProficiencyLevel } from "../shared.enums";

export interface UpdateSkillDto {
    skillName?: string;
    proficiencyLevel?: ProficiencyLevel;
    skillCategory?: string;
    skillDescription?: string;
    yearsOfExperience?: number;
    projectIds?: number[];
}

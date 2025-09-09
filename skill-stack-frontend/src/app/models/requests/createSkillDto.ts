import { ProficiencyLevel } from "../shared.enums";

export interface CreateSkillDto {
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  skillCategory: string;
  skillDescription?: string;
  yearsOfExperience?: number;
  projectIds?: number[];
}
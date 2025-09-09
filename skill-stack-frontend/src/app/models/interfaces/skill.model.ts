import { ProficiencyLevel } from "../shared.enums";
import { Project } from "./project.model";
import { User } from "./user.model";

export interface Skill {
  id: number;
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  skillCategory: string;
  skillDescription?: string;
  yearsOfExperience?: number;
  user?: User;
  projects?: Project[];
}
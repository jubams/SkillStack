import { Goal } from "./goal.model";
import { Project } from "./project.model";
import { Skill } from "./skill.model";
import { SocialLinks } from "./socialLink.model";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  profileImage?: string;
  userBio?: string;
  socialLinks?: SocialLinks;
  projects?: Project[];
  goals?: Goal[];
  skills?: Skill[];
}

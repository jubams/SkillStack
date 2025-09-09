import { Status } from "../shared.enums";
import { Skill } from "./skill.model";
import { User } from "./user.model";

export interface Project {
  id: number;
  projectTitle: string;
  projectDescription?: string;
  thumbnail?: string;
  projectGithubURL?: string;
  projectLiveURL?: string;
  projectStatus: Status;
  projectStartedDate?: string;   
  projectFinishedDate?: string;  
  user?: User;
  skills?: Skill[];
}
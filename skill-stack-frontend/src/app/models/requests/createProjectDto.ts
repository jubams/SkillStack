import { Status } from "../shared.enums";

export interface CreateProjectDto {
  projectTitle: string;
  projectDescription?: string;
  thumbnail?: string;
  projectGithubURL?: string;
  projectLiveURL?: string;
  projectStatus: Status;
  projectStartedDate?: string;
  projectFinishedDate?: string;
  skillIds?: number[];
}
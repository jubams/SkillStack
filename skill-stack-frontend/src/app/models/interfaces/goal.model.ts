import { Priority, Status, TimeLine } from "../shared.enums";
import { Skill } from "./skill.model";
import { User } from "./user.model";

export interface Goal {
  id: number;
  goalTitle: string;
  goalDescription?: string;
  goalStatus: Status;
  goalPriority: Priority;
  goalTimeLine: TimeLine;
  startDate: string;
  dueDate: string;
  category: string;
  progress: number;
  goalNote?: string;
  user?: User;
  skills?: Skill[];
}
import { Priority, Status, TimeLine } from "../shared.enums";

export interface UpdateGoalDto {
    goalTitle?: string;
    goalDescription?: string;
    goalStatus?: Status;
    goalPriority?: Priority;
    goalTimeLine?: TimeLine;
    startDate?: string;
    dueDate?: string;
    category?: string;
    progress?: number;
    goalNote?: string;
    skillIds?: number[];
}

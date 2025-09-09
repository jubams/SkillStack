import {
    required,
    numeric,
    minNumber,
    maxNumber,
    prop
} from '@rxweb/reactive-form-validators';
import { Priority, Status, TimeLine } from '../shared.enums';

export class CreateGoalForm {
    @required({ message: 'Goal title is required' })
    goalTitle: string;

    @prop()
    goalDescription?: string;

    @prop()
    goalStatus?: Status;

    @prop()
    goalPriority?: Priority;

    @prop()
    goalTimeLine?: TimeLine;

    @required({ message: 'Start date is required' })
    startDate: string;

    @required({ message: 'Due date is required' })
    dueDate: string;

    @required({ message: 'Category is required' })
    category: string;

    @numeric({ message: 'Progress must be a number' })
    @minNumber({ value: 0, message: 'Progress cannot be negative' })
    @maxNumber({ value: 100, message: 'Progress cannot exceed 100%' })
    progress?: number;

    goalNote?: string;

    skillIds?: number[];

    constructor(goal?: CreateGoalForm) {
        this.goalTitle = goal?.goalTitle || '';
        this.goalDescription = goal?.goalDescription || '';
        this.goalStatus = goal?.goalStatus || Status.NotStarted;
        this.goalPriority = goal?.goalPriority || Priority.Medium;
        this.goalTimeLine = goal?.goalTimeLine || TimeLine.MedTerm;
        this.startDate = goal?.startDate || '';
        this.dueDate = goal?.dueDate || '';
        this.category = goal?.category || '';
        this.progress = goal?.progress || 0;
        this.goalNote = goal?.goalNote || '';
        this.skillIds = goal?.skillIds || [];
    }
}

export class UpdateGoalForm extends CreateGoalForm {
    constructor(goal?: UpdateGoalForm) {
        super(goal);
    }
}

import {
    required,
    url,
    date
} from '@rxweb/reactive-form-validators';
import { Status } from '../shared.enums';

export class CreateProjectForm {
    @required({ message: 'Project title is required' })
    projectTitle: string;

    projectDescription?: string;

    thumbnail?: string;

    @url({ message: 'Please enter a valid GitHub URL' })
    projectGithubURL?: string;

    @url({ message: 'Please enter a valid live URL' })
    projectLiveURL?: string;

    @required({ message: 'Project status is required' })
    projectStatus: Status;

    @date({ message: 'Please enter a valid start date' })
    projectStartedDate?: string;

    @date({ message: 'Please enter a valid finish date' })
    projectFinishedDate?: string;

    skillIds?: number[];

    constructor(project?: CreateProjectForm) {
        this.projectTitle = project?.projectTitle || '';
        this.projectDescription = project?.projectDescription || '';
        this.thumbnail = project?.thumbnail || '';
        this.projectGithubURL = project?.projectGithubURL || '';
        this.projectLiveURL = project?.projectLiveURL || '';
        this.projectStatus = project?.projectStatus || Status.NotStarted;
        this.projectStartedDate = project?.projectStartedDate || '';
        this.projectFinishedDate = project?.projectFinishedDate || '';
        this.skillIds = project?.skillIds || [];
    }
}

export class UpdateProjectForm extends CreateProjectForm {
    constructor(project?: UpdateProjectForm) {
        super(project);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project } from '../models/interfaces/project.model';
import { CreateProjectDto } from '../models/requests/createProjectDto';
import { UpdateProjectDto } from '../models/requests/updateProjectDto';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService {
    private readonly API_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    create(createProjectDto: CreateProjectDto): Observable<Project> {
        return this.http
            .post<Project>(`${this.API_URL}/projects`, createProjectDto)
            .pipe(catchError(this.handleError));
    }

    findAll(): Observable<Project[]> {
        return this.http
            .get<Project[]>(`${this.API_URL}/projects`)
            .pipe(catchError(this.handleError));
    }

    findOne(id: number): Observable<Project> {
        return this.http
            .get<Project>(`${this.API_URL}/projects/${id}`)
            .pipe(catchError(this.handleError));
    }

    update(id: number, updateProjectDto: UpdateProjectDto): Observable<Project> {
        return this.http
            .patch<Project>(`${this.API_URL}/projects/${id}`, updateProjectDto)
            .pipe(catchError(this.handleError));
    }

    remove(id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.API_URL}/projects/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            if (error.status === 400) {
                errorMessage = error.error?.message || 'Bad request';
            } else if (error.status === 401) {
                errorMessage = 'Unauthorized access';
            } else if (error.status === 403) {
                errorMessage = 'Access forbidden';
            } else if (error.status === 404) {
                errorMessage = 'Project not found';
            } else if (error.status === 409) {
                errorMessage = 'Project already exists';
            } else if (error.status === 500) {
                errorMessage = 'Internal server error';
            } else {
                errorMessage = error.error?.message || `Error ${error.status}`;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
}

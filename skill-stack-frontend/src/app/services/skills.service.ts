import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Skill } from '../models/interfaces/skill.model';
import { CreateSkillDto } from '../models/requests/createSkillDto';
import { UpdateSkillDto } from '../models/requests/updateSkillDto';

@Injectable({
    providedIn: 'root',
})
export class SkillsService {
    private readonly API_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    create(createSkillDto: CreateSkillDto): Observable<Skill> {
        return this.http
            .post<Skill>(`${this.API_URL}/skills`, createSkillDto)
            .pipe(catchError(this.handleError));
    }

    findAll(): Observable<Skill[]> {
        return this.http
            .get<Skill[]>(`${this.API_URL}/skills`)
            .pipe(catchError(this.handleError));
    }

    findOne(id: number): Observable<Skill> {
        return this.http
            .get<Skill>(`${this.API_URL}/skills/${id}`)
            .pipe(catchError(this.handleError));
    }

    update(id: number, updateSkillDto: UpdateSkillDto): Observable<Skill> {
        return this.http
            .patch<Skill>(`${this.API_URL}/skills/${id}`, updateSkillDto)
            .pipe(catchError(this.handleError));
    }

    remove(id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.API_URL}/skills/${id}`)
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
                errorMessage = 'Skill not found';
            } else if (error.status === 409) {
                errorMessage = 'Skill already exists';
            } else if (error.status === 500) {
                errorMessage = 'Internal server error';
            } else {
                errorMessage = error.error?.message || `Error ${error.status}`;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
}

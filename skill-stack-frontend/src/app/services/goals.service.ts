import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Goal } from '../models/interfaces/goal.model';
import { CreateGoalDto } from '../models/requests/createGoalDto';
import { UpdateGoalDto } from '../models/requests/updateGoalDto';

@Injectable({
    providedIn: 'root',
})
export class GoalsService {
    private readonly API_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    create(createGoalDto: CreateGoalDto): Observable<Goal> {
        return this.http
            .post<Goal>(`${this.API_URL}/goals`, createGoalDto)
            .pipe(catchError(this.handleError));
    }

    findAll(): Observable<Goal[]> {
        return this.http
            .get<Goal[]>(`${this.API_URL}/goals`)
            .pipe(catchError(this.handleError));
    }

    findOne(id: number): Observable<Goal> {
        return this.http
            .get<Goal>(`${this.API_URL}/goals/${id}`)
            .pipe(catchError(this.handleError));
    }

    update(id: number, updateGoalDto: UpdateGoalDto): Observable<Goal> {
        return this.http
            .patch<Goal>(`${this.API_URL}/goals/${id}`, updateGoalDto)
            .pipe(catchError(this.handleError));
    }

    remove(id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.API_URL}/goals/${id}`)
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
                errorMessage = 'Goal not found';
            } else if (error.status === 409) {
                errorMessage = 'Goal already exists';
            } else if (error.status === 500) {
                errorMessage = 'Internal server error';
            } else {
                errorMessage = error.error?.message || `Error ${error.status}`;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
}

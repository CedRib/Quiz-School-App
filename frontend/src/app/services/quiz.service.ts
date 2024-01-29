import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../models/quiz';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Attempt } from '../models/attempt';

@Injectable({ providedIn: 'root' })
export class QuizService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/quiz`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getQuizByQuestionId(id: number, newAttempt: 0 | 1): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.baseUrl}api/quiz/byQuestion/${id}/${newAttempt}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getQuizById(id: number): Observable<Quiz | null> {
        return this.http.get<Quiz>(`${this.baseUrl}api/quiz/${id}`).pipe(
            map(data => plainToInstance(Quiz, data)),
            catchError(error => {
                console.error('Error fetching quiz by ID:', error);
                return of(null);
            })
        );
    }

    getByName(name: string) {
		return this.http.get<number>(`${this.baseUrl}api/quiz/byName/${name}`)
			.pipe(map(res => res),
			catchError(err => of(null)));
	}

    createAttempt(attempt: Attempt): Observable<boolean> {
        return this.http.post<Attempt>(`${this.baseUrl}api/attempt`, attempt).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }


    public updateQuiz(q: Quiz): Observable<boolean> {
        return this.http.put<Quiz>(`${this.baseUrl}api/quiz`, q).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public deleteQuiz(qId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/quiz/${qId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public createQuiz(q: Quiz): Observable<boolean> {
        return this.http.post<Quiz>(`${this.baseUrl}api/quiz`, q).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}

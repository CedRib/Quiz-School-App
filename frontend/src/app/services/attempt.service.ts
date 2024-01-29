import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Attempt } from '../models/attempt';
import { Question } from '../models/question';

@Injectable({ providedIn: 'root' })
export class AttemptService {

    private newAttempt : boolean =  false;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    createAttempt(attempt: Attempt): Observable<Attempt | null> {
        return this.http.post<Attempt>(`${this.baseUrl}api/attempt`, attempt).pipe(
            map(data => plainToInstance(Attempt, data)),
            catchError(error => {
                console.error(error);
                return of(null);
            })
        );
    }

    setNewAttempt(value: boolean): boolean {
        this.newAttempt = value;
        return value;
    }

    getNewAttempt(): boolean {
       return this.newAttempt
    }

    getAttemptByQuizId(quizId : number) : Observable<Attempt | null> {
        return this.http.get<Attempt>(`${this.baseUrl}api/attempt/byQuizId/${quizId}`).pipe(
            map(data => plainToInstance(Attempt, data)),
            catchError(error => {
                console.error('Error fetching quiz by ID:', error);
                return of(null);
            })
        );
    }

    closeAttempt(attempt: Attempt): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/attempt/closeAttempt`, attempt).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    



}

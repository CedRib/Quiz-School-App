import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Answer } from '../models/answer';
import { attempt } from 'lodash-es';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class AnswerService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    createAnswer(answer: Answer): Observable<Answer | null> {
        return this.http.post<Answer>(`${this.baseUrl}api/answer`, answer).pipe(
            map(data => plainToInstance(Answer, data)),
            catchError(error => {
                console.error(error);
                return of(null);
            })
        );
    }

}

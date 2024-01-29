import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Answer } from '../models/answer';
import { attempt } from 'lodash-es';
import { plainToInstance } from 'class-transformer';
import { Result } from '../models/result';

@Injectable({ providedIn: 'root' })
export class ResultService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }


    checkQuery(questionId: number): Observable<Result | null> {
        return this.http.get(`${this.baseUrl}api/result/${questionId}`).pipe(
            map(data => plainToInstance(Result, data)),
            catchError(error => {
                console.error(error);
                return of(null);
            })
        );
    }

}    
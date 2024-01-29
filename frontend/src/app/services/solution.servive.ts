import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Database } from '../models/quiz';
import { Question } from '../models/question';
import { Solution } from '../models/solution';

@Injectable({ providedIn: 'root' })
export class SolutionService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getSolutions(): Observable<Solution[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/solution`).pipe(
      map(res => plainToInstance(Solution, res))
    );
  }

  getSolutionsByQuestionId(questionId: number): Observable<Solution[]> {
    return this.http.get<Solution[]>(`${this.baseUrl}api/solution/byQuestion/${questionId}`);
  }


  public deleteSolution(solutionId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/solution/${solutionId}`).pipe(
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public updateSolution(solution: Solution): Observable<boolean> {
    return this.http.put<Solution>(`${this.baseUrl}api/solution`, solution).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public addSolution(solution: Solution): Observable<boolean> {
    return this.http.post<Solution>(`${this.baseUrl}api/solution`, solution).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }



}
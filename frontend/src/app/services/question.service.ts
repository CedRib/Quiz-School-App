import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Database } from '../models/quiz';
import { Question } from '../models/question';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/question`).pipe(
      map(res => plainToInstance(Question, res))
    );
  }

  getQuestionsByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}api/question/byQuiz/${quizId}`);
  }

  getQuestionWhitStudentAnswerByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}api/question/withStudentAnswer/${quizId}`);
  }

  public deleteQuestion(questionId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/question/${questionId}`).pipe(
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }



  public updateQuestion(question: Question): Observable<boolean> {
    return this.http.put<Question>(`${this.baseUrl}api/question`, question).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public addQuestion(question: Question): Observable<boolean> {
    return this.http.post<Question>(`${this.baseUrl}api/question`, question).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }


}
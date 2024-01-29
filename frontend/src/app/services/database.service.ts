import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Database } from '../models/quiz';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getDatabases(): Observable<Database[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/database`).pipe(
            map(res => plainToInstance(Database, res))
        );
    }
}


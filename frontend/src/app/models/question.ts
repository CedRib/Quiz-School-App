import 'reflect-metadata';
import { Solution } from "./solution";
import { Answer } from "./answer";
import { Attempt } from "./attempt";
import { Result } from "./result";


export class Question {
    id?: number;
    questionOrder?: number;
    body?: string;
    quizId?: number;
    solutions? : Solution[];
    answer!: Answer | null;
    attempt?: Attempt;
    result?: Result;
}
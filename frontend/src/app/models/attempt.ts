import { Quiz } from "./quiz";
import 'reflect-metadata';
import { User } from "./user";


export class Attempt {

    id! : number;
    start! : Date;
    finish? : Date;
    isActive?: boolean;
    quizId?: number;
    quiz?: Quiz;
    userId?: number;
    user?: User;

    questionId?: number;
}
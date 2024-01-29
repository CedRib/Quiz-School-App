import 'reflect-metadata';
import { Attempt } from "./attempt";
import { Question } from "./question";


export class Answer {

    id! : number;
    sql!: string;
    timeStamp! : Date;
    attemptId!: number;
    attempt?: Attempt;
    questionId!: number;
    question? : Question;

}
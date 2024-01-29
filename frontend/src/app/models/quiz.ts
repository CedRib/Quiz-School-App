import 'reflect-metadata';
import { Question } from "./question";
import { Attempt } from "./attempt";





export class Quiz {

    id!: number;
    name?: string;
    description?: string;
    isPublished?: boolean;
    isClosed?: boolean;
    isTest?: boolean;
    startDate?: Date;
    endDate?: Date;
    database?: Database;
    databaseId?: number;
    status?: string;

    questions?: Question[];

    firstQuestionId : number = 0;

    withAttempt? : boolean;
    evaluation? : string;


    attempt! : Attempt | null;
  

}





export class Database {
    id?: number;
    name?: string;
    description?: string;
}





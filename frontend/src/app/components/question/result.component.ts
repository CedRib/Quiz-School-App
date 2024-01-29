import { Component, Input } from "@angular/core";
import { Result } from "src/app/models/result";

@Component({
    selector: 'result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.css']

})
export class ResultComponent {

    @Input() result!: Result | null;

    public trueQueryOne: string = "Votre requête a retourné une réponse correcte";
    public trueQueryTwo: string = "Néanmoins, comparez votre solution avec celle(s) ci-dessous pour voir si vous n'avez pas eu un peu de chance... ;)";
    public falseQuery: string = "Votre requête a retourné un mauvais résultat";
    public wrongQueryTitle: string = "Erreur de requête";
    public wrongQuery?: string;
    public isCorrect!: boolean;

    public row?: number;
    public column?: number;

    public columnsLabel: string[] = [];

    public errorList?: string[];

    public data?: string[][];

    get displayCorrect(): boolean {
        return this.result !== null && this.result?.isCorrect === true;
    }

    get displayError(): boolean {
        return (this.result !==null && this.result?.isCorrect === false) && (this.result.wrongQuery === null);
    }


    get displayWrongQuery(): boolean {
        return this.result !== null && this.result?.wrongQuery !== null ;
    }

}

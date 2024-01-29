import { Component, Input } from "@angular/core";
import { Question } from "src/app/models/question";
import { Solution } from "src/app/models/solution";

@Component({
    selector: 'solution',
    templateUrl: './solution.component.html',
    styleUrls: ['./result.component.css']
})
export class SolutionComponent {
    @Input() currentQuestion!: Question;

}

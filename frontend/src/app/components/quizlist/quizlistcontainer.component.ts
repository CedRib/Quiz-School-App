import { Component } from "@angular/core";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Role } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { StateService } from "src/app/services/state.service";

@Component({
    templateUrl: './quizlistcontainer.component.html'
})

export class QuizListContainerComponent {

    filter: string = "";

    
    training: "training" = "training";
    test: "test" = "test";

    constructor(
        private authService: AuthenticationService,
        private stateService: StateService
    ) {
    }

    get isTeacher(): boolean {
        return this.authService.currentUser!.role === Role.Teacher;
    }
}

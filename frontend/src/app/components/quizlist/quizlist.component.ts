import { Component, AfterViewInit, OnDestroy, ViewChild, OnInit, Input } from '@angular/core';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Role } from 'src/app/models/user';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable, map } from 'rxjs';
import { AttemptService } from 'src/app/services/attempt.service';


@Component({
    selector: 'app-quizlist',
    templateUrl: './quizlist.component.html',
    styleUrls: ['./quizlist.component.css']
})
export class QuizListComponent implements AfterViewInit, OnDestroy, OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    state: MatTableState;

    private _filter? : string;
    get filter(): string | undefined {
		return this._filter;
	}
    

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @Input() quiztype!: "test" | "training";
    @Input() set filter(value : string | undefined) {
        this._filter = value;
        this.filterChanged(this._filter);
    }

    constructor(
        public authenticationService: AuthenticationService,
        private router: Router,
        private quizService: QuizService,
        private stateService: StateService,
        private authService: AuthenticationService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private attemptService: AttemptService
    ) {
        this.state = this.stateService.quizListState;
    }

    ngOnInit(): void {
        this.setDisplayedColumns();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
            const str = data.name + ' ' + data.database?.name + ' ' + (data.isTest ? 'Test' : 'Training') + ' ' + data.status + ' ' +
                (data.startDate ? data.startDate.toLocaleDateString() : '') + ' ' +
                (data.endDate ? data.endDate.toLocaleDateString() : '') + ' ' + data.evaluation;
            return str.toLowerCase().includes(filter);
        };
        this.state.bind(this.dataSource);
        this.refresh();
    }

    filterChanged(filter?: string) : void {
        if (filter !== undefined) {
            this.dataSource.filter = filter.trim().toLowerCase();
            this.state.filter = this.dataSource.filter;
            if(this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        }
    }



    refresh() {
        let quizes: Observable<Quiz[]> = this.quizService.getAll();

        switch (this.quiztype) {
            case "training":
                quizes = quizes.pipe(
                    map(q => q.filter(quiz => !quiz.isTest && quiz.isPublished))
                );
                this._filter = this.state.filter;
                break;
            case "test":
                quizes = quizes.pipe(
                    map(q => q.filter(quiz => quiz.isTest && quiz.isPublished))
                );
                this._filter = this.state.filter;
                break;
            default:
                quizes;
                this._filter = this.state.filter;
        }

        quizes.subscribe((q: Quiz[]) => {
            this.dataSource.data = q;
            this.state.restoreState(this.dataSource);
            this._filter = this.state.filter;
        });

    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

    startNewAttempt(row: Quiz): void {
        this.attemptService.setNewAttempt(true);
        this.router.navigate(['/question', row.firstQuestionId]);
    }

    private setDisplayedColumns() {
        if (this.quiztype === "training") {
            this.displayedColumns = ['name', 'database', 'status', 'actions'];
        } else if (this.quiztype === "test") {
            this.displayedColumns = ['name', 'database', 'startDate', 'endDate', 'status', 'evaluation', 'actions'];
        } else {
            this.displayedColumns = ['name', 'database', 'isTest', 'status', 'startDate', 'endDate', 'actions'];
        }
    }


    get isTeacher(): boolean {
        return this.authService.currentUser!.role === Role.Teacher;
    }

    canStudentStart(quiz: Quiz): boolean {
        return (quiz.status === 'Terminé' && !quiz.isTest) || quiz.status === 'Pas Commencé';
    }

    canStudentEdit(quiz: Quiz): boolean {
        return quiz.status === 'En_COURS';
    }

    canStudentCheck(quiz: Quiz): boolean {
        return quiz.status === 'Terminé'
    }

    dateOrNa(quiz : Quiz) : string {
        if (quiz.isTest)
            return "N/A";
        else
            return "";
    }
}    

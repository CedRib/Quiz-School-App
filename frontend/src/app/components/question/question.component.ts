import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/answer";
import { Attempt } from "src/app/models/attempt";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { Result } from "src/app/models/result";
import { AnswerService } from "src/app/services/answer.service";
import { AttemptService } from "src/app/services/attempt.service";
import { ResultService } from "src/app/services/result.service";
import { ConfirmDialogComponent } from "../confirmDialog/confirmdialog.component";
import { QuizService } from "src/app/services/quiz.service";

@Component({
    selector: 'question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

    public quiz?: Quiz;
    public questions: Question[] = [];
    public currentQuestionIndex: number = 0;
    public currentQuestion!: Question;
    public studentAnswer: string = "";
    public database!: string;
    public solutionsVisible: boolean = false;
    public timeStamp?: Date;
    public resultVisible: boolean = false;
    private newAttempt: boolean;
    public result!: Result | null;
    private tempNewAtt? : boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private quizService: QuizService,
        private attemptService: AttemptService,
        private answerService: AnswerService,
        private resultService: ResultService
    ) {
        this.newAttempt = attemptService.getNewAttempt();
        this.loadQuiz();
    }

    ngOnInit(): void {
        this.refresh();
    }

    loadQuiz(): void {
        this.quizService.getQuizByQuestionId(this.route.snapshot.params["id"], this.newAttempt ? 1 : 0).subscribe(q => {
            if (q != null) {
                this.quiz = q;
                this.questions = q.questions!;
                this.ngOnInit();
                this.database = q.database!.name!;
                this.tempNewAtt = this.newAttempt;
            }
            this.newAttempt = this.attemptService.setNewAttempt(false);
        });
    }

    refresh(): void {
        this.currentQuestion = this.questions![this.currentQuestionIndex];
        if (!this.currentQuestion?.answer) {
            this.studentAnswer = '';
            this.resultVisible = false;
            this.solutionsVisible = this.quiz?.status == "terminé" ? true : false;
            this.timeStamp = undefined;
        } else {
            this.studentAnswer = this.newAttempt ? "" : this.currentQuestion.answer.sql;
            this.timeStamp = this.currentQuestion.answer.timeStamp;
            this.checkQuery();
        }

    }

    checkQuery(): void {
        this.resultService.checkQuery(this.currentQuestion.id!).subscribe(r => {
            this.result = r!;
            if (this.quiz!.status == "Terminé" || !this.quiz!.isTest) {
                this.resultVisible = true;
                if(r!.isCorrect || (this.quiz!.status == "Terminé" && !this.quiz!.isTest ))
                    this.solutionsVisible = true;
            }
        });
    }

    send(): void {
        if (this.quiz!.attempt == null || this.quiz!.attempt.finish != null) {
            this.createAttemptAndAnswer();
        } else {
            if (this.currentQuestion.answer?.sql !== this.studentAnswer) {
                this.createAnswer(this.quiz!.attempt!);
            }
        }
    }

    private createAttemptAndAnswer(): void {
        const newAttempt: Attempt = {
            id: 0,
            quiz: this.quiz,
            quizId: this.quiz!.id,
            start: new Date(),
            finish: undefined
        };

        this.attemptService.createAttempt(newAttempt).subscribe(attempt => {
            if (attempt != null) {
                this.quiz!.attempt = attempt;
                this.createAnswer(attempt);
            }
        });
    }

    private createAnswer(attempt: Attempt): void {
        const newAnswer: Answer = {
            id: 0,
            sql: this.studentAnswer,
            timeStamp: new Date(),
            attemptId: attempt.id,
            questionId: this.currentQuestion.id!
        };
        this.answerService.createAnswer(newAnswer).subscribe(a => {
            this.currentQuestion.answer = a;
            this.timeStamp = a?.timeStamp;
            this.checkQuery();

        });
    }

    displaySolutions(): void {
        this.solutionsVisible = !this.solutionsVisible;
    }

    solutionBtnLabel() : string {
        return this.solutionsVisible ? "Cacher Solution" : "Afficher Solution"
    }


    nextQuestion(): void {
        const nextQuestionIndex = this.currentQuestionIndex + 1;
        if (nextQuestionIndex < this.questions.length) {
            this.currentQuestionIndex = nextQuestionIndex;
            this.router.navigate(['/question', this.questions[nextQuestionIndex].id]);
            this.refresh();
        }
    }


    previousQuestion(): void {
        const previousQuestionIndex = this.currentQuestionIndex - 1;
        if (previousQuestionIndex >= 0) {
            this.currentQuestionIndex = previousQuestionIndex;
            this.router.navigate(['/question', this.questions[previousQuestionIndex].id]);
            this.refresh();
        }
    }


    finishAttempt(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: 'Attention vous ne pourrez plus continuer le quiz par après ! Voulez vous continuer ? ',
                confirmText: 'Oui',
                cancelText: 'Non'
            }
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.attemptService.closeAttempt(this.quiz!.attempt!).subscribe(() => {
                    this.quiz!.attempt = null;
                    this.router.navigate(['/quiz']);
                });
            }
        });
    }

    erase(): void {
        this.studentAnswer = "";
        this.resultVisible = false;
        this.solutionsVisible = false;
    }

    get displaySolutionBtn(): boolean {
        return !this.quiz?.isTest && (!this.quiz?.isClosed! && this.quiz?.status !== "Terminé") || (this.tempNewAtt == true && !this.quiz?.isTest);
    }
    

    get editable(): boolean {
        return this.quiz?.isClosed! || (this.quiz?.status === "Terminé" && this.tempNewAtt == false) || this.solutionsVisible == true;

    }

    get saveBtn(): boolean {
        return this.quiz?.status !== "Terminé" || (this.quiz?.isTest == false && this.tempNewAtt == true);
    }

    get disableSend(): boolean {
        return this.studentAnswer == "";
    }







}          
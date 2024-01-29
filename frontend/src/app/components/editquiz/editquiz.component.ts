
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";
import { DatabaseService } from "src/app/services/database.service";
import { QuizService } from "src/app/services/quiz.service";
import { Database, Quiz } from "src/app/models/quiz";
import { Question } from "src/app/models/question";
import { Solution } from "src/app/models/solution";
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from "../confirmDialog/confirmdialog.component";


@Component({
    templateUrl: './editquiz.component.html',
    styleUrls: ['./editquiz.component.css']
})
export class EditQuizComponent implements OnInit {
    public frm!: FormGroup;
    public ctlName!: FormControl;
    public ctlDescription!: FormControl;
    public ctlIsPublished!: FormControl;
    public ctlIsTest!: FormControl;
    public ctlStartDate!: FormControl;
    public ctlEndDate!: FormControl;
    public ctlQuestions!: FormControl;
    public ctlDatabase!: FormControl;

    public databaseName!: string;

    public databases: Database[] = [];
    public quizId: number = 0;
    public quiz!: Quiz;

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private formBuilder: FormBuilder,
        private databaseService: DatabaseService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.quizId = +params["id"];

            if (this.quizId === 0) {
                this.initializeForm();
                this.quiz = new Quiz();
            } else {
                this.quizService.getQuizById(this.quizId).subscribe(q => {
                    this.initializeForm(q);
                    this.quiz = q!;
                    if (!this.editable) {
                        this.ctlIsTest.disable();
                        this.ctlDatabase.disable();
                        this.ctlStartDate.disable();
                        this.ctlEndDate.disable();
                        this.ctlIsPublished.disable();
                        this.snackBar.open('Cannot modified a test with an open attempt', 'Close', {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'center',
                        });
                    }

                });
            }
        });

    }


    initializeForm(quiz: Quiz | null = null): void {
        

        this.ctlName = this.formBuilder.control(quiz?.name, [Validators.required, Validators.minLength(3)], [this.nameUsed()]);
        this.ctlDescription = this.formBuilder.control(quiz?.description);
        this.ctlIsPublished = this.formBuilder.control(quiz?.isPublished == null ? false : quiz.isPublished);
        this.ctlIsTest = this.formBuilder.control(quiz?.isTest, [Validators.required]);
        this.ctlStartDate = this.formBuilder.control(quiz?.startDate);
        this.ctlEndDate = this.formBuilder.control(quiz?.endDate);
        this.ctlQuestions = this.formBuilder.control(quiz?.id != null ? quiz?.questions : [], [Validators.required]);
        this.ctlDatabase = this.formBuilder.control(quiz?.databaseId, [Validators.required]);

        this.databaseService.getDatabases().subscribe(db => {
            this.databases = db;
        });

        this.databaseName = this.ctlDatabase.value == 1 ? "fournisseurs" : "facebook";

        this.frm = this.formBuilder.group({
            name: this.ctlName,
            description: this.ctlDescription,
            isPublished: this.ctlIsPublished,
            isTest: this.ctlIsTest,
            startDate: this.ctlStartDate,
            endDate: this.ctlEndDate,
            database: this.ctlDatabase,
            questions: this.ctlQuestions
        });
    }

    

    save(): void {
        const quizData: Quiz = {
            id: this.quizId!,
            name: this.frm.get('name')!.value,
            description: this.frm.get('description')!.value,
            isPublished: this.frm.get('isPublished')!.value,
            isTest: this.frm.get('isTest')!.value,
            startDate: this.frm.get('startDate')!.value,
            endDate: this.frm.get('endDate')!.value,
            databaseId: this.frm.get('database')!.value,
            questions: this.frm.get('questions')!.value,
            firstQuestionId: 0,
            attempt: this.quiz.attempt
        };
        if (this.quizId != 0) {
            this.quizService.updateQuiz(quizData).subscribe(
                response => {
                    if (response) {
                        this.snackBar.open('Quiz updated successfully', 'Close', {
                            duration: 2000,
                        });
                        this.router.navigate(['/quiz']);
                    } else {
                        this.snackBar.open('Error updating quiz', 'Close', {
                            duration: 3000,
                        });
                    }
                });
        } else {
            this.quizService.createQuiz(quizData).subscribe(response => {
                if (response) {
                    this.snackBar.open('Quiz created succesfully', 'Close', { duration: 2000, });
                    this.router.navigate(['/quiz']);
                } else {
                    this.snackBar.open('Error creating quiz', 'Close', { duration: 3000, });
                }
            });
        }
    }

    nameUsed(): any {
		let timeout: NodeJS.Timeout;
		return (ctlName: FormControl) => {
			clearTimeout(timeout);
			const name = ctlName.value;
			return new Promise(resolve => {
				timeout = setTimeout(() => {
					if (ctlName.pristine)
						resolve(null);
					else
						this.quizService.getByName(name).subscribe(id  => resolve((id != 0 && this.quizId != id) ? { nameUsed: true } : null));
				}, 300)
			})
		};
	}



    deleteQuestion(questionId: number): void {
        const index = this.ctlQuestions.value.findIndex((q: { id: number; }) => q.id === questionId);

        if (index !== -1) {
            this.ctlQuestions.value.splice(index, 1);

        }
        this.reorderQuestion();
    }

    reorderQuestion(): void {
        this.ctlQuestions.value.forEach((q: { questionOrder: any; }, index: number) => {
            q.questionOrder = index + 1;
        });
    }

    deleteSolution(questionId: number, solutionId: number): void {
        const questionIndex = this.ctlQuestions.value.findIndex((q: { id: number; }) => q.id === questionId);

        if (questionIndex !== -1) {
            const question = this.ctlQuestions.value[questionIndex];
            const solutionIndex = question.solutions!.findIndex((s: { id: number; }) => s.id === solutionId);

            if (solutionIndex !== -1) {
                question.solutions!.splice(solutionIndex, 1);
            }
            this.reorderSolution(question);
        }
    }

    reorderSolution(question: Question): void {
        question.solutions?.forEach((s, index) => {
            s.solutionOrder = index + 1;
        });
    }

    addQuestion(): void {
        const newQuestion: Question = {
            id: 0,
            questionOrder: this.ctlQuestions.value.length + 1,
            body: '',
            quizId: this.quiz?.id,
            answer: null,
            solutions: []
        };
        this.ctlQuestions.value!.push(newQuestion);
    }

    addSolution(questionId: number): void {
        const questionIndex = this.ctlQuestions.value.findIndex((q: { id: number; }) => q.id === questionId);

        if (questionIndex !== -1) {
            const question = this.ctlQuestions.value[questionIndex];
            const newSolution: Solution = {
                id: 0,
                solutionOrder: question.solutions!.length + 1,
                sql: '',
                questionId: question.id,
            };
            question.solutions!.push(newSolution);
        }
    }



    moveUpQuestionOrder(currentQuestion: Question): void {
        const currentIndex = this.ctlQuestions.value.indexOf(currentQuestion);

        if (currentIndex > 0) {
            const previousQuestion = this.ctlQuestions.value[currentIndex - 1];
            this.ctlQuestions.value[currentIndex] = previousQuestion;
            this.ctlQuestions.value[currentIndex - 1] = currentQuestion;
            this.reorderQuestion();
        }
    }

    moveDownQuestionOrder(currentQuestion: Question): void {
        const currentIndex = this.ctlQuestions.value.indexOf(currentQuestion);

        if (currentIndex < this.ctlQuestions.value.length - 1) {
            const nextQuestion = this.ctlQuestions.value[currentIndex + 1];
            this.ctlQuestions.value[currentIndex] = nextQuestion;
            this.ctlQuestions.value[currentIndex + 1] = currentQuestion;
            this.reorderQuestion();
        }
    }

    moveUpSolutionOrder(currentQuestion: Question, currentSolution: Solution): void {
        const questionIndex = this.ctlQuestions.value.findIndex((q: { id: number | undefined; }) => q.id === currentQuestion.id);

        if (questionIndex !== -1) {
            const solutions = this.ctlQuestions.value[questionIndex].solutions;

            const solutionIndex = solutions?.indexOf(currentSolution);

            if (solutionIndex > 0) {
                const previousSolution = solutions[solutionIndex - 1];

                solutions[solutionIndex] = previousSolution;
                solutions[solutionIndex - 1] = currentSolution;

                this.reorderSolution(this.ctlQuestions.value[questionIndex]);
            }
        }
    }

    moveDownSolutionOrder(currentQuestion: Question, currentSolution: Solution): void {
        const questionIndex = this.ctlQuestions.value.findIndex((q: { id: number | undefined; }) => q.id === currentQuestion.id);

        if (questionIndex !== -1) {
            const solutions = this.ctlQuestions.value[questionIndex].solutions;

            const solutionIndex = solutions?.indexOf(currentSolution);

            if (solutionIndex < solutions.length - 1) {
                const nextSolution = solutions[solutionIndex + 1];

                solutions[solutionIndex] = nextSolution;
                solutions[solutionIndex + 1] = currentSolution;

                this.reorderSolution(this.ctlQuestions.value[questionIndex]);
            }
        }
    }


    deleteQuiz(): void {
        const quizId: number | undefined = this.quizId;

        if (quizId !== undefined) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    message: 'Attention vous allez supprimer définitivement ce quiz et toutes ses dépendances ! Voulez vous continuer ? ',
                    confirmText: 'Delete',
                    cancelText: 'Cancel'
                }
            });
            dialogRef.afterClosed().subscribe((result: boolean) => {
                if (result) {
                    this.quizService.deleteQuiz(quizId).subscribe(
                        () => {
                            this.snackBar.open('Quiz deleted successfully', 'Close', {
                                duration: 2000,
                            });
                            this.router.navigate(['/quiz']);
                        },
                        (error: any) => {
                            console.error('Error deleting quiz:', error);
                            this.snackBar.open('Error deleting quiz', 'Close', {
                                duration: 3000,
                            });
                        }
                    );
                }
            });
        } else {
            console.error('Quiz ID is undefined');
        }
    }

    get editable(): boolean {
        if (this.quiz.isTest && this.quiz.withAttempt)
            return false;
        else
            return true
    }
}



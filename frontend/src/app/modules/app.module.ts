import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';
import { SharedModule } from './shared.module';
import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuizListComponent } from '../components/quizlist/quizlist.component';
import { EditQuizComponent } from '../components/editquiz/editquiz.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { ConfirmDialogComponent } from '../components/confirmDialog/confirmdialog.component';
import { QuizListContainerComponent } from '../components/quizlist/quizlistcontainer.component';
import { QuestionComponent } from '../components/question/question.component';
import { SolutionComponent } from '../components/question/solution.component';
import { ResultComponent } from '../components/question/result.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        LoginComponent,
        UnknownComponent,
        RestrictedComponent,
        QuizListComponent,
        EditQuizComponent, 
        CodeEditorComponent,
        ConfirmDialogComponent,
        QuizListContainerComponent,
        QuestionComponent,
        SolutionComponent,
        ResultComponent
        
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        BrowserAnimationsModule,
        SharedModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: fr },
        
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: ['dd/MM/yyyy'],
                },
                display: {
                    dateInput: 'dd/MM/yyyy',
                    monthYearLabel: 'MMM yyyy',
                    dateA11yLabel: 'dd/MM/yyyy',
                    monthYearA11yLabel: 'MMM yyyy',
                },
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }

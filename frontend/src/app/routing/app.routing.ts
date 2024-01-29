import { Routes, RouterModule } from '@angular/router';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { Role } from '../models/user';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { EditQuizComponent } from '../components/editquiz/editquiz.component';
import { QuizListContainerComponent } from '../components/quizlist/quizlistcontainer.component';
import { QuestionComponent } from '../components/question/question.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'quiz', pathMatch: 'full' },
    {
        path: 'editquiz/:id',
        component : EditQuizComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
    },
    {
        path : 'question/:id',
        component : QuestionComponent,
    },
    {
        path: 'quiz',
        component: QuizListContainerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    { path: 'restricted', component: RestrictedComponent },
    { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
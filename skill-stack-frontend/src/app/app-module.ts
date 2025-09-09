import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './components/header/header';
import { SkillModal } from './components/modals/skill-modal';
import { DeleteSkillModal } from './components/modals/delete-skill-modal';
import { GoalModal } from './components/modals/goal-modal';
import { DeleteGoalModal } from './components/modals/delete-goal-modal';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { TokenInterceptor } from './auth/token.interceptor';
import { Dashboard } from './pages/dashboard/dashboard';
import { Skills } from './pages/skills/skills';
import { Projects } from './pages/projects/projects';
import { Goals } from './pages/goals/goals';
import { DeleteProjectModal } from './components/modals/delete-project-modal';
import { ProjectModal } from './components/modals/project-modal';

@NgModule({
  declarations: [App, Header, SkillModal, DeleteSkillModal, GoalModal, DeleteGoalModal, Login, Register, Dashboard, Skills, Projects, Goals, DeleteProjectModal, ProjectModal],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RxReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule { }

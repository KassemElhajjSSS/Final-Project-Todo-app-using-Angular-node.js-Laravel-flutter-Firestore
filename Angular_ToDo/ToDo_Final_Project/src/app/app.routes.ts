import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
    { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] }, 
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { MyCalendarComponent } from './components/my-calendar/my-calendar.component';
import { MyChrtsComponent } from './components/my-chrts/my-chrts.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-login',
    component: LoginRegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    component: MyCalendarComponent,
    pathMatch: 'full',
  },
  {
    path: 'charts',
    component: MyChrtsComponent,
    pathMatch: 'full',
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {LoginGuardService} from './services/login-guard.service';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {UserComponent} from './user/user.component';
import {ProfilComponent} from './profil/profil.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {GroupComponent} from './group/group.component';
import {ProjectComponent} from './project/project.component';
import {TaskComponent} from './task/task.component';
import {FilesComponent} from './files/files.component';

const routes: Routes = [
    {path: '', canActivate: [LoginGuardService], component: AuthComponent},
    {path: 'users', canActivate: [AuthService], component: UserComponent},
    {path: 'profile', canActivate: [AuthService], component: ProfilComponent},
    {path: 'change_password', canActivate: [AuthService], component: ChangePasswordComponent},
    {path: 'groups', canActivate: [AuthService], component: GroupComponent},
    {path: 'project', canActivate: [AuthService], component: ProjectComponent},
    {path: 'project/:project', canActivate: [AuthService], component: TaskComponent},
    {path: 'files', canActivate: [AuthService], component: FilesComponent},
    {path: 'files/:folderKey', canActivate: [AuthService], component: FilesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

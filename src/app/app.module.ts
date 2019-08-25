import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatAccordion,
    MatBadgeModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule, MatOptionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule,
} from '@angular/material';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UserService} from './services/user.service';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ProfilComponent } from './profil/profil.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GroupComponent } from './group/group.component';
import { DeleteGroupComponent } from './group/delete-group/delete-group.component';
import { GroupFromComponent } from './group/group-from/group-from.component';
import {GroupService} from './services/group.service';
import { TaskComponent } from './task/task.component';
import { ProjectComponent } from './project/project.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { DeleteTaskComponent } from './task/delete-task/delete-task.component';
import { DeleteProjectComponent } from './project/delete-project/delete-project.component';
import {ProjectService} from './services/project.service';
import {TaskService} from './services/task.service';
import {ProjectFormComponent} from './project/project-from/project-form.component';
import { FilesComponent } from './files/files.component';
import { CreateFolderComponent } from './files/create-folder/create-folder.component';
import { DeleteFileComponent } from './files/delete-file/delete-file.component';
import {FileService} from './services/file.service';
import { ShareComponent } from './files/share/share.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ChatComponent } from './chat/chat.component';
import { AddUserComponent } from './chat/add-user/add-user.component';
import { RemoveUserComponent } from './chat/remove-user/remove-user.component';
import {TokenInterceptorService} from './services/token-interceptor.service';
import { DeleteGroupProjectComponent } from './project/delete-group-project/delete-group-project.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MenuComponent,
    ToolbarComponent,
    UserComponent,
    UserFormComponent,
    DeleteUserComponent,
    ProfilComponent,
    ChangePasswordComponent,
    GroupComponent,
    DeleteGroupComponent,
    GroupFromComponent,
    TaskComponent,
    ProjectComponent,
    TaskFormComponent,
    DeleteTaskComponent,
    ProjectFormComponent,
    DeleteProjectComponent,
    FilesComponent,
    CreateFolderComponent,
    DeleteFileComponent,
    ShareComponent,
    DiscussionComponent,
    ChatComponent,
    AddUserComponent,
    RemoveUserComponent,
    DeleteGroupProjectComponent
  ],
  entryComponents: [
      UserFormComponent,
      DeleteUserComponent,
      GroupFromComponent,
      DeleteGroupComponent,
      ProjectFormComponent,
      DeleteProjectComponent,
      TaskFormComponent,
      DeleteTaskComponent,
      CreateFolderComponent,
      DeleteFileComponent,
      ShareComponent,
      RemoveUserComponent,
      AddUserComponent,
      DeleteGroupProjectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    MatBadgeModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
      UserService,
      GroupService,
      ProjectService,
      TaskService,
      FileService,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

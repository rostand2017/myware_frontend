import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatAccordion,
    MatBadgeModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule,
    MatMenuModule, MatOptionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule,
} from '@angular/material';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UserService} from './services/user.service';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';
import {HttpClientModule} from '@angular/common/http';
import { ProfilComponent } from './profil/profil.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GroupComponent } from './group/group.component';
import { DeleteGroupComponent } from './group/delete-group/delete-group.component';
import { GroupFromComponent } from './group/group-from/group-from.component';
import {GroupService} from './services/group.service';

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
    GroupFromComponent
  ],
  entryComponents: [
      UserFormComponent,
      DeleteUserComponent,
      GroupFromComponent,
      DeleteGroupComponent,
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
    ReactiveFormsModule,
  ],
  providers: [
      UserService,
      GroupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

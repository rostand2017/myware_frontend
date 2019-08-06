import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatAccordion,
    MatBadgeModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule,
} from '@angular/material';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UserService} from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MenuComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  ],
  providers: [
      UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

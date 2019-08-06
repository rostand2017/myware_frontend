import { Component } from '@angular/core';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myware';
  constructor(private userService: UserService) {
  }
  isAuth(): boolean {
    return this.userService.isAuthenticated();
  }
}

import { Component } from '@angular/core';
import {UserService} from './services/user.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myware';
  auth = false;
  constructor(private userService: UserService, private router: Router) {
      this.isAuth();
      this.router.events.subscribe(value => {
          if (value instanceof NavigationStart) {
            this.isAuth();
          }
      });
  }
  isAuth() {
    console.log('Again');
    this.userService.isAuthenticated().subscribe(
        value => this.auth = value
    );
  }
}

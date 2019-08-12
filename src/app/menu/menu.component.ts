import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
  }
  gotoTask() {
    this.router.navigate(['project']);
  }
  gotoUsers() {
    this.router.navigate(['users']);
  }
  gotoDiscussion() {
    this.router.navigate(['discussion']);
  }
  gotoGroups() {
    this.router.navigate(['groups']);
  }
  gotoFiles() {
    this.router.navigate(['files']);
  }
  onDisconnect() {
      this.userService.disconnect().subscribe(value => console.log('user disconnected'),
          (error) => console.log('une erreur est survenue'));
  }

}

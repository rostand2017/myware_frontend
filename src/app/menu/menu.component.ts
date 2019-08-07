import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  gotoTask() {
    this.router.navigate(['task']);
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

}

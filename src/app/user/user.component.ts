import { Component, OnInit } from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {MatDialog} from '@angular/material';
import {UserFormComponent} from './user-form/user-form.component';
import {DeleteUserComponent} from './delete-user/delete-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  panelOpenState = false;
  users: User[];
  user: User;
  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
      this.users = this.userService.getUsers();
  }
  openDialog() {
    const dialogRef = this.dialog.open(UserFormComponent, {
        data: {user: this.user}
    });
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // dialog closed.If submission is ok, call getUsers
      });
  }
  onEdit(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
        data: user
    });
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // dialog closed.If submission is ok, call getUsers
      });
  }
  onDelete(user: User) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
        data: user
    });
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // dialog closed.If submission is ok, call getUsers
      });
  }
}

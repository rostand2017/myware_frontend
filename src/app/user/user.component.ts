import { Component, OnInit } from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserFormComponent} from './user-form/user-form.component';
import {DeleteUserComponent} from './delete-user/delete-user.component';
import {Constant} from '../model/constant';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  panelOpenState = false;
  users: User[] = [];
  user: User;
  error = '';
  isEmpty = false;
  loadEnd = false;
  constructor(private userService: UserService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getActiveUsers().subscribe(
        (users) => {
            if (users.length === 0) {
                this.isEmpty = true;
            }
            this.loadEnd = true;
            this.users = users;
        },
        error => {
          this.error = 'Une erreur est survenue';
          console.log('Une erreur est survenue');
        }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(UserFormComponent, {
        data: {user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            return;
          }
          switch (result.status) {
              case Constant.ADD_SUCCESS:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  this.users.push(result.user);
                  break;
              case Constant.ADD_FAILED:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  break;
          }
          console.log('The dialog was closed');
      });
  }

  onEdit(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
        data: user
    });
    dialogRef.afterClosed().subscribe(result => {
          if (!result) {
              return;
          }
          switch (result.status) {
              case Constant.MODIFY_SUCCESS:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  this.users = this.users.filter(value => {
                      if (value.keyy !== result.user.keyy) {
                          return value;
                      }
                  });
                  this.users.push(result.user);
                  break;
              case Constant.MODIFY_FAILED:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  break;
          }
          console.log('The dialog was closed');
      });
  }

  onDelete(user: User) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
        data: user
    });
    dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            return;
          }
          switch (result.status) {
              case Constant.DELETE_SUCCESS:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  this.users = this.users.filter(value => {
                      if (value.keyy !== result.key) {
                          return value;
                      }
                  });
                  break;
              case Constant.DELETE_FAILED:
                  this.snackBar.open(result.mes, 'ok', {
                      duration: 2000,
                  });
                  break;
          }
          console.log('The dialog was closed');
      });
  }
}

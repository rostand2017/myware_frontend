import {Component, OnInit} from '@angular/core';
import {GroupService} from '../services/group.service';
import {Group} from '../model/group';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GroupFromComponent} from './group-from/group-from.component';
import {DeleteGroupComponent} from './delete-group/delete-group.component';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {Constant} from '../model/constant';
import {MessageService} from '../services/message.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[] = [];
  group: Group;
  error = '';
  isEmpty = false;
  loadEnd = false;
  user: User;

    constructor(public dialog: MatDialog, private groupService: GroupService,
              private router: Router, private snackBar: MatSnackBar, private userService: UserService) {
    }

    ngOnInit() {
      this.user = this.userService.user;
      this.getGroups();
    }
    getGroups() {
        this.groupService.getGroups().subscribe(
            (groups) => {
                if (groups.length === 0) {
                    this.isEmpty = true;
                }
                this.loadEnd = true;
                this.groups = groups;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEnd = true;
            }
        );
    }

    openDialog() {
        const dialogRef = this.dialog.open(GroupFromComponent, {
            data: new Group('', '', '')
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.groups.push(result.group);
                    break;
                case Constant.MODIFY_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onEdit(group: Group) {
        const dialogRef = this.dialog.open(GroupFromComponent, {
        data: group
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.groups = this.groups.filter(value => {
                        if (value.keyy !== result.group.keyy) {
                            return value;
                        }
                    });
                    this.groups.push(result.group);
                    break;
                case Constant.MODIFY_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onDelete(group: Group) {
        const dialogRef = this.dialog.open(DeleteGroupComponent, {
        data: group
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.groups = this.groups.filter(value => {
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
        });
    }
    onDiscussion(group: Group) {
      this.router.navigate(['discussion/' + group.keyy]);
    }
}

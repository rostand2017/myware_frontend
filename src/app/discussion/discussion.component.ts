import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {DeleteGroupComponent} from '../group/delete-group/delete-group.component';
import {Group} from '../model/group';
import {RemoveUserComponent} from '../chat/remove-user/remove-user.component';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
    users: User[];
    user: User;

    constructor(public dialog: MatDialog, private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.getUsers();
    }
    getUsers() {
        this.users = this.userService.getUsers();
        // alert(this.users[0].name);
    }
    onDiscussion(user: User) {
        this.router.navigate(['discussion/' + user.keyy]);
    }
}

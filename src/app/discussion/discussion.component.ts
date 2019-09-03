import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {DeleteGroupComponent} from '../group/delete-group/delete-group.component';
import {Group} from '../model/group';
import {RemoveUserComponent} from '../chat/remove-user/remove-user.component';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
    users: User[] = [];
    user: User;
    error = '';
    isEmpty = false;
    loadEnd = false;
    constructor(public dialog: MatDialog, private userService: UserService,
                private router: Router, private messageService: MessageService) { }

    ngOnInit() {
        this.getUsers();
    }
    getUsers() {
        this.userService.getDiscussionUsers().subscribe(
            (users) => {
                if (users.length === 0) {
                    this.isEmpty = true;
                }
                this.loadEnd = true;
                this.users = users;
            },
            error => {
                this.loadEnd = true;
                this.error = 'Une erreur est survenue';
            }
        );
    }
    onDiscussion(user: User) {
        this.router.navigate(['discussion/' + user.keyy]);
    }
}

import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {MessageService} from '../services/message.service';
import {ReceiveMessage} from '../model/receive-message';
import {RemoveUserComponent} from './remove-user/remove-user.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddUserComponent} from './add-user/add-user.component';
import {Message} from '../model/message';
import {GroupService} from '../services/group.service';
import {Constant} from '../model/constant';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: User[] = [];
  currentUser: User = new User('', '', '', '', '', '', '', '', '');
  messages: ReceiveMessage[];
  offset = 0;
  discussionKey: String;
  discussionObject: any = {};
  elt: Element;
  loadEndUser: boolean;
  loadEndMessage: boolean;
  isEmptyUser: boolean;
  isEmptyMessage: boolean;
  errorMessage = '';
  errorUser = '';
  constructor(public dialog: MatDialog, private userService: UserService,
              private messageService: MessageService, private groupService: GroupService,
              private router: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.discussionKey = this.router.snapshot.paramMap.get('key');
    this.messageService.getDiscussionType(this.discussionKey).subscribe(
        (data) => {
            this.discussionObject = data;
            if (!data.subname) {
                this.getUsers();
            }
        }
    );
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    this.getMessages();
  }
  getUsers() {
      this.groupService.getMembers(this.discussionKey).subscribe(
          (users) => {
              if (users.length === 0) {
                  this.isEmptyUser = true;
              }
              this.loadEndUser = true;
              this.users = users;
          },
          error => {
              this.loadEndUser = true;
              this.errorUser = 'Une erreur est survenue';
          }
      );
  }
  getMessages() {
    this.loadEndMessage = true;
    this.messages = this.messageService.getMessages(this.offset, this.offset + 25, this.discussionKey);
    this.elt = document.getElementById('sendMessageContainer');
    /*setTimeout(function () {
        this.elt = document.getElementById('sendMessageContainer');
        this.elt.scrollTo(0, this.elt.scrollHeight - this.elt.clientHeight );
    }, 3000);*/
    this.elt.scrollTo(0, this.elt.scrollHeight - this.elt.clientHeight );
    console.log(this.elt);
    console.log(this.elt.scrollHeight - this.elt.clientHeight);
  }
  getMoreMessages(event, element) {
    this.messages = this.messageService.getMessages(this.offset, this.offset + 25, this.discussionKey);
  }
  onRemove(user: User) {
      const dialogRef = this.dialog.open(RemoveUserComponent, {
          data: {user: user, groupKey: this.discussionKey}
      });
      dialogRef.afterClosed().subscribe(result => {
          if (!result) {
              return;
          }
          this.snackBar.open(result.mes, 'ok', {
              duration: 4000,
          });
          if (result.status === Constant.DELETE_SUCCESS) {
              this.users = this.users.filter(value => {
                  if (value.keyy !== user.keyy) {
                      return value;
                  }
              });
          }
      });
  }
  onAddMember() {
    const dialogRef = this.dialog.open(AddUserComponent, {
        data: this.discussionKey
    });
    dialogRef.afterClosed().subscribe(result => {
        if (!result) {
            return;
        }
        this.snackBar.open(result.mes, 'ok', {
            duration: 3000,
        });
        if (result.status === Constant.ADD_SUCCESS) {
            for (let i = 0; i < result.users.length; i++) {
                this.users.push(result.users[i]);
            }
        }
    });
  }
  onFileInput(event) {
    if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            const data: FormData = new FormData();
            for ( let i = 0; i < files.length; i++) {
                data.append(`data` + i, files[i], files[i].name );
            }
            data.append('data', files[0]);
            // start a progress bar here
            this.messageService.addFile(data, this.discussionKey).
            subscribe(value => {}, error => console.log('error'), () => console.log(files[0]));
        }
  }
  onSendMessage(inputMessage: HTMLInputElement) {
      if (inputMessage.value.trim()) {
          const message = new Message(inputMessage.value, '', '');
          inputMessage.value = '';
          this.messageService.sendMessage(message, this.currentUser.keyy, this.discussionKey).subscribe(
              (receiveMessage) => {
                  this.messages.push(receiveMessage);
              },
              () => {console.log('Une erreur est survenue'); }
          );
      }
  }
  loadImage() {
      this.messages.forEach(
          (message) => {
              if (message.type === 'image') {
                 // sd
              }
          }
      );
  }
}

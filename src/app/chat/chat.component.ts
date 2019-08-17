import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {MessageService} from '../services/message.service';
import {ReceiveMessage} from '../model/receive-message';
import {RemoveUserComponent} from './remove-user/remove-user.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AddUserComponent} from './add-user/add-user.component';
import {Message} from '../model/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: User[];
  currentUser: User;
  messages: ReceiveMessage[];
  offset = 0;
  discussionKey: String;
  elt: Element;
  constructor(public dialog: MatDialog, private userService: UserService, private messageService: MessageService,
              private router: ActivatedRoute) { }

  ngOnInit() {
    this.discussionKey = this.router.snapshot.paramMap.get('key');
    this.getUsers();
    this.getMessages();
  }
  getUsers() {
    this.users = this.userService.getUsersGroup();
    this.currentUser = this.userService.getCurrentUser();
  }
  getMessages() {
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
          console.log('The dialog was closed');
          // dialog closed.If submission is ok, call getGroups
      });
  }
    onAddMember() {
        const dialogRef = this.dialog.open(AddUserComponent, {
            data: this.discussionKey
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getProjects
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
              (receiveMessage) => { console.log('Receive message'); /*this.messages.push(receiveMessage);*/ },
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

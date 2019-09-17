import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {MessageService} from '../services/message.service';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  user: User;
  countUnreadMessage = 0;
  countUnreadDirectMessage = 0;
  tableCount: any = {
    messages: {},
    directMessages: {}
  };
  constructor(private router: Router, private userService: UserService,
              private messageService: MessageService, private socket: Socket) { }

  ngOnInit() {
      this.user = this.userService.user;
      this.getUnreadMessages();
  }

  getAllNewMessage() {
      Notification.requestPermission().then(
          value => {
              if (value === 'granted') {
                  this.socket.fromEvent('message').subscribe(
                      message => {
                          const n = new Notification(message.senderName.toString(), {body: message.message.toString()});
                          if (message.type === 'group') {
                              this.countUnreadMessage++;
                              n.onclick = () => this.gotoDirectDiscussion(message.discussionKey);
                          } else {
                              this.countUnreadDirectMessage++;
                              n.onclick = () => this.gotoDirectDiscussion(message.discussionKey);
                          }
                      }
                  );
                  /*
                  setInterval(() => {
                      this.messageService.getAllNewMessages(this.tableCount.messages.lastDate / 1000,
                          'group').subscribe(
                          (data) => {
                              if (data.length === 0) {
                                  return;
                              }
                              this.tableCount.messages.count += data.length;
                              this.tableCount.messages.lastDate = parseInt(data[data.length - 1].date.toString(), 10) * 1000;
                              data.forEach(
                                  (message) => {
                                      const n = new Notification(message.senderName.toString(), {body: message.message.toString()});
                                      n.onclick = () => { this.router.navigate(['/discussion/' + message.link]); };
                                  }
                              );
                          },
                          error2 => {},
                          () => this.getNewDirectMessages()
                      );
                  }, 10000);
                  */
              } else {
                  console.log('Accès refusée aux otifications');
              }
          }
      );
  }

  getNewDirectMessages() {
      this.messageService.getAllNewMessages(this.tableCount.directMessages.lastDate / 1000,
          'directMessage').subscribe(
          (data) => {
              if (data.length === 0) {
                  return;
              }
              this.tableCount.directMessages.count += data.length;
              this.tableCount.directMessages.lastDate = parseInt(data[data.length - 1].date.toString(), 10) * 1000;
              data.forEach(
                  (message) => {
                      const n = new Notification(message.senderName.toString(), {body: message.message.toString()});
                      n.onclick = () => { this.router.navigate(['/discussion/' + message.link]); };
                  }
              );
          }
      );
  }

  getUnreadMessages() {
      this.messageService.getCountUnreadMessages().subscribe(
          (data) => {
              /*this.tableCount.messages.lastDate = data.messages.lastDate * 1000;
              this.tableCount.messages.count = data.messages.count;
              this.tableCount.directMessages.lastDate = data.directMessages.lastDate * 1000;
              this.tableCount.directMessages.count = data.directMessages.count;
              */
              this.countUnreadMessage = data.messages.count;
              this.countUnreadDirectMessage = data.directMessages.count;
              this.getAllNewMessage();
          },
          (error) => {
              // error
          }
      );
  }

  gotoDiscussionGroup(discussionKey) {
    this.router.navigate(['discussion/' + discussionKey]);
  }
  gotoDirectDiscussion(discussionKey) {
    this.router.navigate(['discussion/' + discussionKey]);
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
      this.userService.disconnect();
  }

}

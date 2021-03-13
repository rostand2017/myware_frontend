import { Component, OnInit } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {MessageService} from '../services/message.service';
import {Socket} from 'ngx-socket-io';
import {ReceiveMessage} from '../model/receive-message';
import {MatSnackBar} from '@angular/material';

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
  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar,
              private messageService: MessageService, private socket: Socket) { }

  ngOnInit() {
      this.userService.getCurrentUser().subscribe(
          (user) => {
              this.user = user;
              this.getUnreadMessages();
          },
          error2 => {},
      );
      this.router.events.subscribe((ev) => {
          if (ev instanceof NavigationStart) {
              if (this.router.url.match('/discussion')) {
                  this.countUnreadDirectMessage = 0;
              }
              if (this.router.url.match('/groups')) {
                  this.countUnreadMessage = 0;
              }
          }
      });
  }

  getAllNewMessage() {
      this.socket.emit('connects', this.user);
      this.socket.fromEvent('connectedUser').subscribe(
          (user: User) => {
              console.log(user);
              console.log(user.subname);
              this.snackBar.open(user.subname + ' ' + user.name + ' est en ligne', 'ok',
                  {duration: 2000});
          }
      );
      this.socket.fromEvent('disconnectedUser').subscribe(
          (user: User) => {
              console.log(user);
              this.snackBar.open(user.subname + ' ' + user.name + ' s\'est déconnecté', 'ok',
                  {duration: 2000});
          }
      );
      Notification.requestPermission().then(
          value => {
              if (value === 'granted') {
                  this.socket.fromEvent('message').subscribe(
                      (message) => {
                          console.log(message);
                          const m: ReceiveMessage = new ReceiveMessage('', '', '', '',
                          '', '', '', '');
                          Object.assign(m, message);
                          if (!(this.router.url === '/discussion/' + m.discussionKey && m.discussionType === 'group' ||
                              this.router.url === '/discussion/' + m.senderKey && m.discussionType !== 'group') ) {
                              const n = new Notification(m.senderName.toString(),
                                  {body: m.message.toString(), icon: '../../favicon.ico'});
                              n.onclick = () => window.location.assign(
                                  (m.discussionType === 'group') ? '/discussion/' + m.discussionKey : '/discussion/' + m.senderKey
                              );
                              if (m.discussionType === 'group') {
                                  this.countUnreadMessage++;
                              } else {
                                  this.countUnreadDirectMessage++;
                              }
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
                  console.log('Accès refusé aux notifications');
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

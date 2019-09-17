import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {MessageService} from '../services/message.service';
import {ReceiveMessage} from '../model/receive-message';
import {RemoveUserComponent} from './remove-user/remove-user.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddUserComponent} from './add-user/add-user.component';
import {GroupService} from '../services/group.service';
import {Constant} from '../model/constant';
import {FileService} from '../services/file.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  users: User[] = [];
  currentUser: User = new User('', '', '', '', '', '', '', '', '');
  messages: ReceiveMessage[] = [];
  offset = 0;
  discussionKey: String;
  discussionObject: any = {};
  @ViewChild('sendMessageContainer') elt: ElementRef;
  todayDate = new Date();
  loadEndUser: boolean;
  loadEndMessage: boolean;
  isEmptyUser: boolean;
  isEmptyMessage: boolean;
  isLoadAllMessages = false;
  errorMessage = '';
  errorLoadMessage = '';
  errorUser = '';
  messageHandle: number;
  navigationEnd: boolean;
  files: any;
  constructor(public dialog: MatDialog, private userService: UserService,
              private messageService: MessageService, private groupService: GroupService,
              private router: ActivatedRoute, private fileService: FileService, private socket: Socket,
              private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private routerr: Router) {
  }

  ngOnInit() {
    this.discussionKey = this.router.snapshot.paramMap.get('key');
    this.currentUser = this.userService.user;
    this.messageService.getDiscussionType(this.discussionKey).subscribe(
        (data) => {
            this.discussionObject = data;
            if (!data.subname) {
                this.getUsers();
            }
        }
    );
    // this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    this.getMessages();
    this.routerr.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
            this.navigationEnd = true;
        }
    });
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
      this.messageService.getMessages(this.offset, this.discussionKey).subscribe(
          (messages) => {
              this.loadEndMessage = true;
              messages.forEach(
                  (message) => {
                      this.messages.unshift(message);
                  }
              );
              this.offset += 20;
              setTimeout(
                   () => {
                       this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
                   }, 1000
              );
              if (this.messages.length === 0) {
                  this.isEmptyMessage = true;
              }
              this.messages.forEach(
                  m => {
                      const date = new Date(parseInt(m.date.toString(), 10) * 1000);
                      m.dateToShow = date;
                      m.hour = date.getHours() + ':' + date.getMinutes();
                      if (m.type === 'image') {
                          this.fileService.downloadThumbnail(m.link).subscribe(
                              value => {
                                  m.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
                              },
                              error2 => {
                                  console.log('error');
                              }
                          );
                      }
                  }
              );
              this.getNewMessages();
          },
          error => {
              this.errorMessage = 'Une erreur est survenue';
              this.loadEndMessage = true;
          }
      );
      /*this.elt.scrollTo(0, this.elt.scrollHeight - this.elt.clientHeight );
      console.log(this.elt);
      console.log(this.elt.scrollHeight - this.elt.clientHeight);*/
  }

  getNewMessages() {
      this.messageHandle = setTimeout( () => {
          if (this.messages.length !== 0 && this.messages[this.messages.length - 1].date === '') {
              this.getNewMessages();
              return;
          }
          const lastDate = (this.messages.length !== 0) ? this.messages[this.messages.length - 1].date : '';
          this.messageService.getNewMessages(lastDate, this.discussionKey).subscribe(
              messages1 => {
                  if (messages1.length > 0 && this.isEmptyMessage) {
                      this.isEmptyMessage = false;
                  }
                  messages1.forEach(
                      value => {
                          const date = new Date(parseInt(value.date.toString(), 10) * 1000);
                          value.dateToShow = date;
                          value.hour = date.toLocaleTimeString().substring(0, 5);
                          this.messages.push(value);
                          if (value.type === 'image') {
                              this.fileService.downloadThumbnail(value.link).subscribe(
                                  data => {
                                      value.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
                                  },
                                  error => {
                                      // error
                                  }
                              );
                          }
                      }
                  );
                  if (this.navigationEnd) {
                      return;
                  }
                  this.getNewMessages();
              },
          error => this.getNewMessages()
          );
          // this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
      }, 1000);
  }

  getMoreMessages(event) {
      if (this.isLoadAllMessages || !this.loadEndMessage) {
          return;
      }
      // this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
      if ( this.elt.nativeElement.scrollTop === 0 ) {
          this.loadEndMessage = false;
          this.errorLoadMessage = '';
          this.messageService.getMessages(this.offset, this.discussionKey).subscribe(
              (messages) => {
                  this.loadEndMessage = true;
                  if (messages.length === 0) {
                      this.isLoadAllMessages = true;
                      return;
                  }
                  this.offset += 20;
                  this.elt.nativeElement.scrollTo(0, 20);
                  messages.forEach(
                      value => {
                          const date = new Date(parseInt(value.date.toString(), 10) * 1000);
                          value.dateToShow = date;
                          value.hour = date.toLocaleTimeString().substring(0, 5);
                          this.messages.unshift(value);
                          if (value.type === 'image') {
                              this.fileService.downloadThumbnail(value.link).subscribe(
                                  data => {
                                      value.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
                                  },
                                  error2 => {
                                      // error
                                  }
                              );
                          }
                      }
                  );
              },
              error => {
                  this.errorLoadMessage = 'Une erreur est survenue, veuillez Recharger';
                  this.loadEndMessage = true;
              }
          );
      }
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
        this.errorMessage = '';
        this.files = event.target.files;
        const data: FormData = new FormData();
        for ( let i = 0; i < this.files.length; i++) {
            data.append( 'file', this.files[i], this.files[i].name );
            const message = new ReceiveMessage('Envoi du fichier...', 'file', i.toString(),
                '', '', this.currentUser.keyy, '--:--', '');
            const ext = this.files[i].name.split('.').pop().toLowerCase();
            if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
                message.type = 'image';
                message.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.files[i]));
            }
            message.dateToShow = new Date();
            this.messages.push(message);
            this.isEmptyMessage = false;
            data.append('keyy', this.discussionKey.toString());
            setTimeout(
                () => {
                    this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
                }, 1000
            );
            this.messageService.addFile(data).subscribe(
                value => {
                    if ( value.status === 0) {
                        this.socket.emit('message', value.message);
                        const date = new Date(parseInt(value.message.date.toString(), 10) * 1000);
                        message.date = value.message.date;
                        message.hour = date.toLocaleTimeString().substring(0, 5);
                        message.message = value.message.message;
                        message.link = value.message.link;
                    } else {
                        message.sent = false;
                    }
                },
                error => {
                    message.sent = false;
                }
            );
        }
    }
  }

  onResendFile(message: ReceiveMessage) {
      message.sent = true;
      const data: FormData = new FormData();
      data.append('keyy', this.discussionKey.toString());
      data.append( 'file', this.files[parseInt(message.link.toString(), 10)],
          this.files[parseInt(message.link.toString(), 10)].name );
      this.messageService.addFile(data).subscribe(
          value => {
              if ( value.status === 0) {
                  this.socket.emit('message', value.message);
                  const date = new Date(parseInt(value.message.date.toString(), 10) * 1000);
                  message.date = value.message.date;
                  message.hour = date.toLocaleTimeString().substring(0, 5);
                  message.message = value.message.message;
                  message.link = value.message.link;
              } else {
                  message.sent = false;
              }
          },
          error => {
              message.sent = false;
          }
      );
  }

  onSendMessage(inputMessage: HTMLInputElement) {
      if (inputMessage.value.trim()) {
          const message = new ReceiveMessage( inputMessage.value, 'message', '',
              this.currentUser.name, this.currentUser.subname, this.currentUser.keyy, '--:--', '');
          message.dateToShow = new Date();
          this.messages.push(message);
          this.isEmptyMessage = false;
          this.messageService.sendMessage(inputMessage.value, this.discussionKey).subscribe(
              (data) => {
                  this.socket.emit('message', data);
                  const date = new Date(parseInt(data.date.toString(), 10) * 1000);
                  message.date = data.date;
                  message.hour = date.toLocaleTimeString().substring(0, 5);
              },
              () => {
                  message.sent = false;
              }
          );
          inputMessage.value = '';
          setTimeout(
              () => {
                  this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
              }, 1000
          );
      }
  }

  onEnterSendMessage (event, inputMessage) {
      if (event.keyCode === 13) {
          this.onSendMessage(inputMessage);
      }
  }

  resendMessage(message: ReceiveMessage) {
      message.sent = true;
      this.messageService.sendMessage(message.message, this.discussionKey).subscribe(
          (data) => {
              this.socket.emit('message', data);
              const date = new Date();
              message.hour = date.toLocaleTimeString().substring(0, 5);
          },
          () => {
              message.sent = false;
          }
      );
  }

  downloadFile(link: String) {
    this.fileService.downloadFile(link).subscribe(
        value => {
            window.open(URL.createObjectURL(value));
            console.log('download end');
        },
        error2 => {
            this.snackBar.open('Une erreur est survenue lors du téléchargement du fichier. Réessayez plus tard',
                'ok', {
                duration: 2000,
            });
        }
    );
  }
}

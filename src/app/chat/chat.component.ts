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
import {AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent} from 'ngx-agora';

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
  @ViewChild('inputMessage') inputMessage: ElementRef;
  todayDate = new Date();
  loadEndUser: boolean;
  loadEndMessage: boolean;
  isEmptyUser: boolean;
  isEmptyMessage: boolean;
  isLoadAllMessages = false;
  errorMessage = '';
  errorLoadMessage = '';
  errorUser = '';
  callEnd = true;
  files: any;

  localCallId = 'agora_local';
  remoteCalls: string[] = [];

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;

  constructor(public dialog: MatDialog, private userService: UserService, private ngxAgoraService: NgxAgoraService,
              private messageService: MessageService, private groupService: GroupService,
              private router: ActivatedRoute, private fileService: FileService, private socket: Socket,
              private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private routerr: Router) {
      this.uid = Math.floor(Math.random() * 100);
  }

  ngOnInit() {
    this.discussionKey = this.router.snapshot.paramMap.get('key');
    this.currentUser = this.userService.user;
      this.userService.getCurrentUser().subscribe(
          (user) => {
              this.currentUser = user;
              this.getMessages();
          }
      );
    this.messageService.getDiscussionType(this.discussionKey).subscribe(
        (data) => {
            this.discussionObject = data;
            if (!data.subname) {
                this.getUsers();
            }
        }
    );
    this.routerr.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
            // this.socket.removeListener('message');
        }
    });
  }

  startVideoCall() {
      this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
      this.assignClientHandlers();
      this.callEnd = false;
      this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
      this.assignLocalStreamHandlers();
      this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
  }
  stopCall() {
      this.client.leave(
          () => {
              console.log('Disconnection');
              this.client = null;
              this.localStream.stop();
              this.remoteCalls = [];
              this.localStream = null;
              this.onSendMessage(this.currentUser.subname + '  ' + this.currentUser.name + ' a quitté la conférence',
                  'user_joint_conference');
          },
          error => console.log('Disconnection failed')
      );
      this.callEnd = true;
  }
  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
      this.client.join(null, this.discussionObject.name, this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
      this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
        console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
        console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
      this.localStream.init(
          () => {
            // The user has granted access to the camera and mic.
            this.localStream.play(this.localCallId);
            if (onSuccess) {
                onSuccess();
            }
          },
          err => console.error('getUserMedia failed', err)
      );
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
        console.log('Publish local stream successfully');
        this.onSendMessage(this.currentUser.subname + '  ' + this.currentUser.name + ' a rejoint la conférence',
            'user_joint_conference');
    });

    this.client.on(ClientEvent.Error, error => {
        console.log('Got error msg:', error.reason);
        if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
            this.client.renewChannelKey(
                '',
                () => console.log('Renewed the channel key successfully.'),
                renewError => console.error('Renew channel key failed: ', renewError)
            );
        }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
        const stream = evt.stream as Stream;
        this.client.subscribe(stream, { audio: true, video: true }, err => {
            console.log('Subscribe stream failed', err);
        });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
        const stream = evt.stream as Stream;
        const id = this.getRemoteId(stream);
        if (!this.remoteCalls.length) {
            this.remoteCalls.push(id);
            setTimeout(() => stream.play(id), 1000);
        }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
        const stream = evt.stream as Stream;
        if (stream) {
            stream.stop();
            this.remoteCalls = [];
            console.log(`Remote stream is removed ${stream.getId()}`);
        }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
        const stream = evt.stream as Stream;
        if (stream) {
            stream.stop();
            this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
            console.log(`${evt.uid} left from this channel`);
        }
    });
  }

  private getRemoteId(stream: Stream): string {
        return `agora_remote-${stream.getId()}`;
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
                      m.hour = date.toLocaleTimeString().substring(0, 5);
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
      this.socket.fromEvent('message').subscribe(
          (message: any) => {
              console.log('Arrived');
              if (this.routerr.url === '/discussion/' + message._discussionKey ||
                  (this.routerr.url === '/discussion/' + message._senderKey && message._discussionType !== 'group')) {
                  if (this.isEmptyMessage) {
                      this.isEmptyMessage = false;
                  }
                  const m: ReceiveMessage = new ReceiveMessage('', '', '', '',
                      '', '', '', '');
                  Object.assign(m, message);
                  const date = new Date(parseInt(m.date.toString(), 10) * 1000);
                  m.dateToShow = date;
                  m.hour = date.toLocaleTimeString().substring(0, 5);
                  this.messages.push(m);
                  if (m.type === 'image') {
                      this.fileService.downloadThumbnail(message._link).subscribe(
                          data => {
                              message.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
                          },
                          error => {
                              // error
                          }
                      );
                  }
              }
          }
      );
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
                        message.discussionKey = this.discussionObject.subname ? this.discussionObject.keyy : this.discussionKey;
                        message.discussionName = this.discussionObject.subname ? this.currentUser.name : this.discussionObject.name ;
                        message.discussionType = this.discussionObject.subname ? 'direct' : 'group';
                        const date = new Date(parseInt(value.message.date.toString(), 10) * 1000);
                        message.date = value.message.date;
                        message.link = value.message.link;
                        message.message = value.message.message;
                        this.socket.emit('message', message);
                        message.hour = date.toLocaleTimeString().substring(0, 5);
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

  onSendMessage(inputMessage: string, type?: string) {
      if (inputMessage.trim()) {
          const message = new ReceiveMessage( inputMessage, '', '',
              this.currentUser.name, this.currentUser.subname, this.currentUser.keyy, '--:--', '');
          message.type = type ? type : 'message';
          message.dateToShow = new Date();
          this.messages.push(message);
          this.isEmptyMessage = false;
          this.messageService.sendMessage(inputMessage, this.discussionKey, message.type).subscribe(
              (data) => {
                  message.date = data.date;
                  message.discussionKey = this.discussionObject.subname ? this.discussionObject.keyy : data.keyy;
                  message.discussionName = this.discussionObject.subname ? this.currentUser.name : this.discussionObject.name ;
                  message.discussionType = this.discussionObject.subname ? 'direct' : 'group';
                  this.socket.emit('message', message);

                  const date = new Date(parseInt(data.date.toString(), 10) * 1000);
                  message.hour = date.toLocaleTimeString().substring(0, 5);
              },
              () => {
                  message.sent = false;
              }
          );
          this.inputMessage.nativeElement.value = '';
          setTimeout(
              () => {
                  this.elt.nativeElement.scrollTo(0, this.elt.nativeElement.scrollHeight - this.elt.nativeElement.clientHeight );
              }, 1000
          );
      }
  }

  onEnterSendMessage (event, inputMessage) {
      if (event.keyCode === 13) {
          this.onSendMessage(inputMessage.value);
      }
  }

  resendMessage(message: ReceiveMessage) {
      message.sent = true;
      this.messageService.sendMessage(message.message, this.discussionKey, message.type).subscribe(
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

import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../model/user';
import {FileService} from '../services/file.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input('menu') menu;
  @Input('sil') sil: string;
  user: User;
  constructor(private router: Router, private userService: UserService, private fileService: FileService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
      this.userService.getCurrentUser().subscribe( user => {
              this.user = user;
              if (!user.image) {
                  return;
              }
              this.fileService.downloadThumbnail(user.image).subscribe(
                  value => {
                      this.user.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
                  }
              );
          }
      );
  }
  onProfil() {
    this.router.navigate(['profile']);
  }
  onChangePassword() {
    this.router.navigate(['change_password']);
  }
  onDisconnect() {
    this.userService.disconnect();
  }
  onToggleMenu() {
      this.menu.opened = !this.menu.opened;
  }
}

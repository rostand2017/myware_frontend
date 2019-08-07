import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
  }
  onProfil() {
    this.router.navigate(['profile']);
  }
  onChangePassword() {
    this.router.navigate(['change_password']);
  }
  onDisconnect() {
    this.userService.disconnect().subscribe(value => console.log('user disconnected'),
        (error) => console.log('une erreur est survenue'));
  }
}

import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  error = '';
  userForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
      this.userForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required],
      });
  }
  onSubmitForm() {
    if (!this.userForm.invalid) {
      const value = this.userForm.value;
      this.userService.login(value.email, value.password).subscribe(
          (data) => {
            if (data.status === 0) {
                localStorage.setItem('token', data.token);
                window.location.assign('/groups');
                // this.router.navigate(['groups']);
            } else {
              this.error = data.mes;
            }
          },
          () => {
            this.error = 'Une erreur est survenue';
          }
      );
    }
  }
}

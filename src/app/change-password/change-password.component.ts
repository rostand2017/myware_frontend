import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../model/user';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
      this.userForm = this.formBuilder.group(
          {
              password: ['', [Validators.required, Validators.minLength(6)]],
              newPassword: ['', [Validators.required, Validators.minLength(6)]],
          }
      );
  }
  onSubmitForm() {
      this.submitted = true;
      this.error = '';
      this.success = '';
      if (this.userForm.invalid) {
          return;
      }
      const formValue = this.userForm.value;
      this.userService.changePassword(formValue.password, formValue.newPassword).subscribe( (data: any) => {
          if (data.status === 0) {
              this.success = data.mes;
          } else {
              console.log('APPEAR');
              this.error = data.mes;
          }
          } ,
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur est survenue'; }
      );
      console.log(formValue);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: User = new User('', '', '', '', '', '', '', '', '');
  userForm: FormGroup;
  submitted = false;
  submitting = false;
  error = '';
  success = '';

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.initForm();
      this.getUser();
  }
  getUser () {
    this.userService.getCurrentUser().subscribe( user => {
            this.user = user;
            this.initForm();
        },
        (error) => { console.log('Une erreur est survenue'); } );
  }
  initForm() {
      this.userForm = this.formBuilder.group(
          {
              name: [this.user.name, Validators.required],
              fonction: [this.user.fonction, Validators.required],
              type: [this.user.type, Validators.required],
              tel: [this.user.tel, [Validators.required, Validators.pattern('[0-9]{8,12}')]],
              email: [this.user.email, [Validators.required, Validators.email]],
              password: [''],
              subname: [this.user.subname],
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
      this.submitting = true;
      const formValue: User = this.userForm.value;
      formValue.keyy = this.user.keyy;
      this.userService.modifyMe(formValue).subscribe( (data) => {
            if (data.status === 0 ) {
                this.success = data.mes;
                this.user = data.user;
                this.initForm();
            } else {
                this.error = data.mes;
            }
          },
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur est survenue'; },
          () => this.submitting = false
      );
      console.log(formValue);
  }
}

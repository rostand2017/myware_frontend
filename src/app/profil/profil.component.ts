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
  error = '';

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.getUser();
      this.initForm();
  }
  getUser () {
    this.userService.getCurrentUser().subscribe( user => this.user = user,
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
              password: [this.user.password, [Validators.required, Validators.minLength(6)]],
              subname: [this.user.subname],
          }
      );
  }
  onSubmitForm() {
      this.submitted = true;
      this.error = '';
      if (this.userForm.invalid) {
          return;
      }
      const formValue: User = this.userForm.value;
      formValue.keyy = this.user.keyy;
      this.userService.add(formValue).subscribe( (user: User) => {} /* this.user = user*/,
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
      );
      console.log(formValue);
  }
}

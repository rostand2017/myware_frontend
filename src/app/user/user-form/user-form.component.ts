import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  userForm: FormGroup;
  submitted = false;
  error = '';
  constructor(public dialogRef: MatDialogRef<UserFormComponent>, private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: User, private formBuilder: FormBuilder) {
    this.user = data;
  }
  ngOnInit() {
    this.initForm();
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
      formValue.key = this.user.key;
      this.userService.add(formValue).subscribe( (user: User) => {} /* this.user = user*/,
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
      );
      console.log(formValue);
  }

  onCancel(): void {
      this.dialogRef.close();
  }

}

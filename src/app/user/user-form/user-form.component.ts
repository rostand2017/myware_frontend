import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  userForm: FormGroup;
  submitted = false;
  submitting = false;
  error = '';
  success = '';
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
      if (this.user.keyy) {
          this.userService.modify(formValue).subscribe( (data: any) => {
                  if (data.status === 0) {
                      this.success = data.mes;
                      this.user = data.user;
                      this.dialogRef.close({status: Constant.MODIFY_SUCCESS, user: data.user, mes: data.mes});
                  } else {
                      this.error = data.mes;
                  }
              },
              () => { this.error = 'Une erreur est survenue'; },
              () => this.submitting = false
          );
      } else {
          this.userService.add(formValue).subscribe( (data: any) => {
                  if (data.status === 0) {
                      this.success = data.mes;
                      this.user = data.user;
                      this.dialogRef.close({status: Constant.ADD_SUCCESS, user: data.user, mes: data.mes});
                  } else {
                      this.error = data.mes;
                  }
              },
              () => { this.error = 'Une erreur est survenue'; },
              () => this.submitting = false
          );
      }
      console.log(formValue);
  }

  onCancel(): void {
      this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
  }

}

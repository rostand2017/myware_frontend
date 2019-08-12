import {Component, Inject, OnInit} from '@angular/core';
import {Group} from '../../model/group';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupService} from '../../services/group.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UserFormComponent} from '../../user/user-form/user-form.component';
import {UserService} from '../../services/user.service';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-group-from',
  templateUrl: './group-from.component.html',
  styleUrls: ['./group-from.component.css']
})
export class GroupFromComponent implements OnInit {
  submitted = false;
  error = '';
  group: Group;
  groupForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<UserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: Group,
                private groupService: GroupService, private formBuilder: FormBuilder) {
        this.group = data;
    }

  ngOnInit() {
      this.initForm();
  }

  initForm() {
      this.groupForm = this.formBuilder.group(
          {
              name: [this.group.name, Validators.required],
              description: [this.group.name, Validators.required],
          }
      );
  }
  onSubmitForm() {
      this.submitted = true;
      this.error = '';
      if (this.groupForm.invalid) {
          return;
      }
      const formValue: Group = this.groupForm.value;
      formValue.key = this.group.key;
      this.groupService.add(formValue).subscribe( (group: Group) => {} /* this.user = user*/,
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
      );
      console.log(formValue);
  }
  onCancel(): void {
    this.dialogRef.close(Constant.MESSAGE_BAD);
  }
}

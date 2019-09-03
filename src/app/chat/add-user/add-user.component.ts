import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserFormComponent} from '../../user/user-form/user-form.component';
import {ProjectService} from '../../services/project.service';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {GroupService} from '../../services/group.service';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
    submitted = false;
    submitting = false;
    isEmpty = false;
    loadEnd = false;
    error = '';
    users: User[];
    groupKey: String;
    addUserForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<UserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: String,
                private projectService: ProjectService, private formBuilder: FormBuilder, private groupService: GroupService,
                private userService: UserService) {
        this.groupKey = data;
    }

    ngOnInit() {
        this.getUsers();
        this.initForm();
    }
    getUsers() {
        this.groupService.getOtherMembers(this.groupKey).subscribe(
            (users) => {
                if (users.length === 0) {
                    this.isEmpty = true;
                }
                this.loadEnd = true;
                this.users = users;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEnd = true;
            }
        );
    }
    initForm() {
        this.addUserForm = this.formBuilder.group(
            {
                users: new FormArray([])
            }
        );
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.addUserForm.invalid) {
            return;
        }
        const formValue = this.addUserForm.value;
        this.groupService.addMember(formValue.users, this.groupKey).subscribe( (data) => {
                if (data.status === 0) {
                    this.dialogRef.close({status: Constant.ADD_SUCCESS, mes: data.mes, users: data.users});
                } else {
                    this.dialogRef.close({status: Constant.ADD_FAILED, mes: data.mes});
                }
            },
            () => this.error = 'Une erreur est survenue'
        );
        console.log(formValue);
    }
    onCancel(): void {
        this.dialogRef.close();
    }
    onCheckChange(event) {
        const formArray: FormArray = this.addUserForm.get('users') as FormArray;
        if (event.checked) {
            formArray.push(new FormControl(event.source.value));
        } else {
            let i = 0;
            formArray.controls.forEach((ctrl: FormControl) => {
                if (ctrl.value === event.source.value) {
                    // Remove the unselected element from the arrayForm
                    formArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }
}

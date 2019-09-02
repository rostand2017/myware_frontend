import {Component, Inject, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../model/constant';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Group} from '../../model/group';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
    submitted = false;
    submitting = false;
    error = '';
    data: any;
    users: User[] = [];
    groups: Group[] = [];
    fileForm: FormGroup;
    isEmpty = false;
    loadEndGroups = false;
    loadEndUsers = false;
    isEmptyGroups = false;
    isEmptyUsers = false;

    constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ShareComponent>, @Inject(MAT_DIALOG_DATA) public _data: any,
                private fileService: FileService, private groupService: GroupService, private formBuilder: FormBuilder,
                private userService: UserService) {
        this.data = _data;
    }

    ngOnInit() {
        this.getUsers();
        this.getGroups();
        this.initForm();
    }
    getUsers() {
        this.userService.getDiscussionUsers().subscribe(
            (users) => {
                if (users.length === 0) {
                    this.isEmptyGroups = true;
                }
                this.loadEndUsers = true;
                this.users = users;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEndUsers = true;
            }
        );
    }
    getGroups() {
        this.groupService.getGroups().subscribe(
            (groups) => {
                if (groups.length === 0) {
                    this.isEmptyGroups = true;
                }
                this.loadEndGroups = true;
                this.groups = groups;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEndGroups = true;
            }
        );
    }
    initForm() {
        this.fileForm = this.formBuilder.group(
            {
                keyy: [this.data.keyy],
                users: new FormArray([]),
                groups: new FormArray([]),
            }
        );
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.fileForm.invalid) {
            return;
        }
        this.submitting = true;
        const formValue = this.fileForm.value;
        if (this.data.extension) {
            this.fileService.shareFile(formValue).subscribe( (data: any) => {
                    if (data.status === 0) {
                        this.dialogRef.close({status: Constant.SHARE_SUCCESS, mes: data.mes});
                    } else {
                        this.error = data.mes;
                    }
                },
                () => {
                    this.error = 'Une erreur est survenue';
                    this.submitting = false;
                },
                () => this.submitting = false
            );
        } else {
            this.fileService.shareFolder(formValue).subscribe( (data: any) => {
                        if (data.status === 0) {
                            this.dialogRef.close({status: Constant.SHARE_SUCCESS, mes: data.mes});
                        } else {
                            this.error = data.mes;
                        }
                    },
                () => {
                    this.error = 'Une erreur est survenue';
                    this.submitting = false;
                },
                () => this.submitting = false
            );
        }
        console.log(formValue);
    }



    onCancel(file): void {
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onCheckChangeGroup(event) {
        const formArray: FormArray = this.fileForm.get('groups') as FormArray;
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
    onCheckChangeUser(event) {
        const formArray: FormArray = this.fileForm.get('users') as FormArray;
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

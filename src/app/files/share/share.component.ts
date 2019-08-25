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
    error = '';
    data: any;
    users: User[] = [];
    groups: Group[] = [];
    fileForm: FormGroup;
    isEmpty = false;
    loadEnd = false;

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
        // this.users = this.userService.getUsers();
    }
    getGroups() {
        this.groupService.getGroups().subscribe(
            (groups) => {
                if (groups.length === 0) {
                    this.isEmpty = true;
                }
                this.loadEnd = true;
                this.groups = groups;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEnd = true;
            }
        );
    }
    initForm() {
        this.fileForm = this.formBuilder.group(
            {
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
        const formValue = this.fileForm.value;
        if (this.data.extension) {
            this.fileService.shareFile(formValue, this.data.key).subscribe( (data: any) => {} /* this.user = user*/,
                () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
            );
        } else {
            this.fileService.shareFolder(formValue, this.data.key).subscribe( (data: any) => {} /* this.user = user*/,
                () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
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

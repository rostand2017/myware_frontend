import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Task} from '../../model/task';
import {TaskService} from '../../services/task.service';
import {Constant} from '../../model/constant';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user';
import {DeleteTaskComponent} from '../delete-task/delete-task.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
    submitted = false;
    error = '';
    success = '';
    data: any;
    users: User[] = [];
    taskForm: FormGroup;
    isEmpty = false;
    loadEnd = false;
    submitting = false;

    constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<TaskFormComponent>, @Inject(MAT_DIALOG_DATA) public _data: any,
                 private taskService: TaskService, private formBuilder: FormBuilder) {
        this.data = _data;
    }

    ngOnInit() {
        this.getUsers();
        this.initForm();
    }
    getUsers() {
        if (this.data.task.keyy === '') {
            console.log('project: ' + this.data.projectKey);
            this.taskService.getProjectUsers(this.data.projectKey).subscribe(
                (users) => {
                    if (users.length === 0) {
                        this.isEmpty = true;
                    }
                    this.users = users;
                },
                error => {
                    this.error = 'Une erreur est survenue';
                    this.loadEnd = true;
                },
                () => this.loadEnd = true
            );
        } else {
            this.taskService.getOtherProjectUsers(this.data.task.keyy, this.data.projectKey).subscribe(
                (users) => {
                    if (users.length === 0) {
                        this.isEmpty = true;
                    }
                    console.log(users);
                    this.users = users;
                },
                error => {
                    this.error = 'Une erreur est survenue';
                    this.loadEnd = true;
                },
                () => this.loadEnd = true
            );
        }
    }
    initForm() {
        this.taskForm = this.formBuilder.group(
            {
                description: [this.data.task.description, Validators.required],
                endDate: [new Date(this.data.task.endDate), Validators.required],
                isCompleted: [this.data.task.isCompleted],
                users: new FormArray([])
            }
        );
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        this.success = '';
        if (this.taskForm.invalid) {
            return;
        }
        this.submitting = true;
        const formValue: Task = this.taskForm.value;
        const key = this.data.task.keyy;
        formValue.keyy = key;
        this.taskService.add(formValue, this.data.list.keyy).subscribe( (data) => {
                this.data.task = data.task;
                if (data.status === 0) {
                    if ( key === '') {
                        this.dialogRef.close({status: Constant.ADD_SUCCESS, task: data.task, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.MODIFY_SUCCESS, task: data.task, mes: data.mes});
                    }
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

    onCancelTask(task): void {
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: { type: 'task', task: task}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.status === Constant.DELETE_FAILED) {
                this.error = result.mes;
            } else {
                this.dialogRef.close({status: result.status, key: result.key, mes: result.mes});
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
    }

    onCheckChange(event) {
        console.log('key: ' + event.source.value);
        const formArray: FormArray = this.taskForm.get('users') as FormArray;
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

    onRemoveUserTask (user: User, task: Task) {
        this.success = '';
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: {user: user, task: task, type: 'userTask'}
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.success = result.mes;
                    task.users = task.users.filter(value => {
                        if (value.keyy !== result.key) {
                            return value;
                        }
                    });
                    console.log(task.users);
                    break;
                case Constant.DELETE_FAILED:
                    this.error = result.mes;
                    break;
            }
        });
    }

    /*selected(user: User): boolean {
        this.isSelected = false;
        this.data.task.users.forEach((_user) => {
            if ( _user.keyy === user.keyy ) {
                this.isSelected = true;
                return ;
            }
        });
        return this.isSelected;
    }*/
}

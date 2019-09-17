import { Component, OnInit } from '@angular/core';
import {List} from '../model/list';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../services/task.service';
import {DeleteTaskComponent} from './delete-task/delete-task.component';
import {Task} from '../model/task';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../model/constant';
import {TaskFormComponent} from './task-form/task-form.component';
import {Location} from '@angular/common';
import {UserService} from '../services/user.service';
import {User} from '../model/user';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    lists: List[] = [];
    list: List;
    selectedList: List;
    listForm: FormGroup;
    submittedList = false;
    name: String;
    error = '';
    loadEnd = false;
    submitting = false;
    user: User;

    constructor(public dialog: MatDialog, private taskService: TaskService, private location: Location,
                private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
                private snackBar: MatSnackBar, private userService: UserService) { }

    ngOnInit() {
        this.user = this.userService.user;
        this.getLists();
        this.initForm();
    }
    getLists() {
        this.taskService.getLists(this.route.snapshot.paramMap.get('project')).subscribe(
            (lists) => {
                this.loadEnd = true;
                this.lists = lists;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEnd = true;
            }
        );
    }

    initForm() {
        this.listForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    openDialog(list: List) {
        if (this.user.type !== 'Admin') {
            return;
        }
        const dialogRef = this.dialog.open(TaskFormComponent, {
            data: { task: new Task('', '', '', false), list: list,
            projectKey: this.route.snapshot.paramMap.get('project')
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            switch (result.status) {
                case Constant.ADD_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    list.task.push(result.task);
                    break;
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    list.task = list.task.filter(
                        value => {
                            if (value.keyy !== result.key) {
                                return value;
                            }
                        }
                    );
                    break;
            }
        });
    }

    onEditTask(task: Task, list: List) {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            data: { task: task, list: list, projectKey: this.route.snapshot.paramMap.get('project')}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            switch (result.status) {
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    const taskResult = result.task;
                    console.log(task);
                    task.description = taskResult.description;
                    task.endDate = taskResult.endDate;
                    task.isCompleted = taskResult.isCompleted;
                    task.users = taskResult.users;
                    console.log(task);
                    break;
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    list.task = list.task.filter(
                        value => {
                            if (value.keyy !== result.key) {
                                return value;
                            }
                        }
                    );
                    break;
            }
        });
    }

    onSubmitList(inputList: HTMLInputElement) {
        this.submittedList = true;
        this.error = '';
        if (this.listForm.invalid) {
            return;
        }
        this.submitting = true;
        const formValue: List = this.listForm.value;
        formValue.keyy = '';
        this.taskService.addList(formValue, this.route.snapshot.paramMap.get('project')).subscribe(
            data => {
                    if (data.status === 0) {
                        this.lists.push(data.list);
                        inputList.value = '';
                    } else {
                        this.snackBar.open(data.mes, 'ok', {
                            duration: 2000,
                        });
                    }
                },
            () => {
                this.error = 'Une erreur est survenue';
                this.submitting = false;
            },
            () => this.submitting = false
        );
        console.log(formValue);
    }

    onEditList(list: List) {
        if (!list.name.trim() || this.user.type !== 'Admin' ) {
            return;
        }
        this.taskService.addList(list, this.route.snapshot.paramMap.get('project')).subscribe(
            data => {
                if (data.status === 0 ) {
                    list.name = data.list.name;
                }
                this.snackBar.open(data.mes, 'ok', {
                    duration: 2000,
                });
            },
            () => {
                this.snackBar.open('Une erreur est survenue', 'ok', {
                    duration: 3000,
                });
            }
        );
    }

    onDeleteList(list: List) {
        if (this.user.type !== 'Admin') {
            return;
        }
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: { type: 'list', list: list}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    console.log('key: ' + result.key);
                    this.lists = this.lists.filter(value => {
                        if (value.keyy !== result.key) {
                            return value;
                        }
                    });
                    break;
                case Constant.DELETE_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onSelectedList(list: List) {
        this.selectedList = list;
    }
    onBack() {
        this.location.back();
    }
}

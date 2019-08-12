import { Component, OnInit } from '@angular/core';
import {List} from '../model/list';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../services/task.service';
import {DeleteTaskComponent} from './delete-task/delete-task.component';
import {Task} from '../model/task';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../model/constant';
import {TaskFormComponent} from './task-form/task-form.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    lists: List[];
    list: List;
    selectedList: List;
    listForm: FormGroup;
    submittedList = false;
    name: String;

    constructor(public dialog: MatDialog, private taskService: TaskService, private location: Location,
                private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getLists();
        this.initForm();
    }
    getLists() {
        this.lists = this.taskService.getLists(this.route.snapshot.paramMap.get('project'));
    }

    initForm() {
        this.listForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    openDialog(list: List) {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            data: { task: new Task('', '', ''), list: list}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getLists
        });
    }

    onEditTask(task: Task, list: List) {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            data: { task: task, list: list}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getLists
        });
    }

    onSubmitList() {
        this.submittedList = true;
        if (this.listForm.invalid) {
            return;
        }
        const formValue: List = this.listForm.value as List;
        this.taskService.addList(formValue, this.route.snapshot.paramMap.get('project')).subscribe(
            _list => { this.lists.push(_list); } /* this.user = user*/,
            () => { console.log('Une erreur est survenue'); }
        );
        console.log(formValue);
    }

    onEditList(list: List) {
        if (!list.name.trim()) {
            return;
        }
        alert(list.name);
        this.taskService.addList(list, this.route.snapshot.paramMap.get('project')).subscribe(
            _list => { console.log('goood'); } /* this.user = user*/,
            () => { console.log('Une erreur est survenue'); }
        );
        console.log(list);
    }

    onDeleteList(list: List) {
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: { type: 'list', list: list}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === Constant.MESSAGE_OK) {
                // remove item
            }
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getLists
        });
    }

    onDeleteTask(task: Task) {
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: { type: 'task', task: task}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getLists
        });
    }

    onSelectedList(list: List) {
        this.selectedList = list;
    }
    onBack() {
        this.location.back();
    }
}

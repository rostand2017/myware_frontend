import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Task} from '../../model/task';
import {TaskService} from '../../services/task.service';
import {UserFormComponent} from '../../user/user-form/user-form.component';
import {Constant} from '../../model/constant';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Group} from '../../model/group';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {ActivatedRoute} from '@angular/router';
import {DeleteTaskComponent} from '../delete-task/delete-task.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
    submitted = false;
    error = '';
    data: any;
    users: User[] = [];
    taskForm: FormGroup;
    isSelected = false;

    constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<TaskFormComponent>, @Inject(MAT_DIALOG_DATA) public _data: any,
                private route: ActivatedRoute, private taskService: TaskService,
                private formBuilder: FormBuilder, private userService: UserService) {
        this.data = _data;
        this.data.task.users = this.userService.getIntervenant(this.data.task.key);
    }

    ngOnInit() {
        this.getUsers();
        this.initForm();
    }
    getUsers() {
        this.users = this.userService.getProjectUsers(this.route.snapshot.paramMap.get('task'));
    }
    initForm() {
        this.taskForm = this.formBuilder.group(
            {
                description: [this.data.task.description, Validators.required],
                endDate: [this.data.task.endDate, Validators.required],
                isCompleted: [this.data.task.isCompleted],
                users: new FormArray([])
            }
        );
        const formArray: FormArray = this.taskForm.get('users') as FormArray;
        this.data.task.users.forEach((user => {
            formArray.push(new FormControl(user.key));
        }));
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.taskForm.invalid) {
            return;
        }
        const formValue: Task = this.taskForm.value;
        formValue.key = this.data.task.key;
        this.taskService.add(formValue, this.data.list.key).subscribe( (task: Task) => {} /* this.user = user*/,
            () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
        );
        console.log(formValue);
    }

    onCancelTask(task): void {
        const dialogRef = this.dialog.open(DeleteTaskComponent, {
            data: { type: 'task', task: task}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.dialogRef.close(Constant.MESSAGE_BAD);
            if (result === Constant.MESSAGE_OK) {
                // remove item
            }
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getLists
        });
    }

    onCancel(task): void {
      this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onCheckChange(event) {
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
    selected(user: User): boolean {
        this.isSelected = false;
        this.data.task.users.forEach((_user) => {
            if ( _user.key === user.key ) {
                this.isSelected = true;
                return ;
            }
        });
        return this.isSelected;
    }
}

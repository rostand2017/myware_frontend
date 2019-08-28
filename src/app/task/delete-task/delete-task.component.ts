import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GroupService} from '../../services/group.service';
import {Constant} from '../../model/constant';
import {List} from '../../model/list';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.css']
})
export class DeleteTaskComponent implements OnInit {
    constructor(
        private taskService: TaskService,
        public dialogRef: MatDialogRef<DeleteTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
    }
    onDelete(): void {
        if ( this.data.type === 'list' ) {
            this.taskService.deleteList(this.data.list).subscribe(
                (data) => {
                    if (data.status === 0 ) {
                        this.dialogRef.close( {key: this.data.list.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
                (error) => this.dialogRef.close(Constant.MESSAGE_OK)
            );
        } else if (this.data.type === 'task') {
            this.taskService.deleteTask(this.data.task).subscribe(
                (data) => {
                    if (data.status === 0 ) {
                        this.dialogRef.close( {key: this.data.task.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
                (error) => this.dialogRef.close(Constant.MESSAGE_OK)
            );
        } else {
            this.taskService.deleteUserTask(this.data.user, this.data.task).subscribe(
                (data) => {
                    if (data.status === 0 ) {
                        this.dialogRef.close( {key: this.data.user.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
                (error) => this.dialogRef.close(Constant.MESSAGE_OK)
            );
        }
    }
    ngOnInit() {
    }

}

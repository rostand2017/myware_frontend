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
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onDelete(): void {
        if ( this.data.type === 'list' ) {
            this.taskService.deleteList(this.data.list).subscribe(
                (group) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Groupe supprimé'); },
                (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); }
                );
        } else {
            this.taskService.deleteTask(this.data.task).subscribe(
                (group) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Groupe supprimé'); },
                (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); }
            );
        }
    }
    ngOnInit() {
    }

}

import {Component, Inject, OnInit} from '@angular/core';
import {Constant} from '../../model/constant';
import {DeleteProjectComponent} from '../delete-project/delete-project.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProjectService} from '../../services/project.service';
import {Group} from '../../model/group';

@Component({
  selector: 'app-delete-group-project',
  templateUrl: './delete-group-project.component.html',
  styleUrls: ['./delete-group-project.component.css']
})
export class DeleteGroupProjectComponent implements OnInit {
    constructor(
        private projectService: ProjectService,
        public dialogRef: MatDialogRef<DeleteProjectComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
    }
    onDeleteProject(): void {
        this.projectService.deleteGroupProject(this.data.project.keyy, this.data.group.keyy).subscribe(
            (data) => {
                if (data.status === 0 ) {
                    this.dialogRef.close( {projectKey: this.data.project.keyy, groupKey: this.data.group.keyy,
                        status: Constant.DELETE_SUCCESS, mes: data.mes});
                } else {
                    this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                }
            },
            (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); } );
    }
    ngOnInit() {
    }}

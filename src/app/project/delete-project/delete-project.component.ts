import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Constant} from '../../model/constant';
import {Project} from '../../model/project';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.css']
})
export class DeleteProjectComponent implements OnInit {
    constructor(
        private projectService: ProjectService,
        public dialogRef: MatDialogRef<DeleteProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Project) {}

    onNoClick(): void {
        this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
    }
    onDeleteProject(): void {
        this.projectService.deleteProject(this.data).subscribe(
            (data) => {
                if (data.status === 0 ) {
                    this.dialogRef.close( {key: this.data.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                } else {
                    this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                }
            },
            (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); }
        );
    }
    ngOnInit() {
    }
}

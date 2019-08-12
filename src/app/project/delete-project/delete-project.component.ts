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
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onDeleteProject(): void {
        this.projectService.delete(this.data).subscribe(
            (project) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Projet supprimé'); },
            (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); } );
    }
    ngOnInit() {
    }

}

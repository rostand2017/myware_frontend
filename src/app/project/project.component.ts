import { Component, OnInit } from '@angular/core';
import {DeleteProjectComponent} from '../project/delete-project/delete-project.component';
import {Project} from '../model/project';
import {MatDialog} from '@angular/material';
import {ProjectService} from '../services/project.service';
import {Router} from '@angular/router';
import {ProjectFormComponent} from './project-from/project-form.component';
import {Group} from '../model/group';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    projects: Project[];
    project: Project;

    constructor(public dialog: MatDialog, private projectService: ProjectService, private router: Router) { }

    ngOnInit() {
        this.getProjects();
    }
    getProjects() {
        this.projects = this.projectService.getProjects();
        // alert(this.projects[0].name);
    }

    openDialog() {
        const dialogRef = this.dialog.open(ProjectFormComponent, {
            data: new Project('', '', [new Group('', '', '')] )
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getProjects
        });
    }

    onEdit(project: Project) {
        const dialogRef = this.dialog.open(ProjectFormComponent, {
            data: project
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getProjects
        });
    }

    onDelete(project: Project) {
        const dialogRef = this.dialog.open(DeleteProjectComponent, {
            data: project
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getProjects
        });
    }
}

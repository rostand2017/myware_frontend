import { Component, OnInit } from '@angular/core';
import {DeleteProjectComponent} from '../project/delete-project/delete-project.component';
import {Project} from '../model/project';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProjectService} from '../services/project.service';
import {Router} from '@angular/router';
import {ProjectFormComponent} from './project-from/project-form.component';
import {Group} from '../model/group';
import {Constant} from '../model/constant';
import {DeleteGroupProjectComponent} from './delete-group-project/delete-group-project.component';
import {UserService} from '../services/user.service';
import {User} from '../model/user';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    projects: Project[] = [];
    project: Project;
    error = '';
    isEmpty = false;
    loadEnd = false;
    user: User;

    constructor(public dialog: MatDialog, private projectService: ProjectService, private router: Router,
                private snackBar: MatSnackBar, private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(
            user => this.user = user
        );
        this.getProjects();
    }
    getProjects() {
        this.projectService.getProjects().subscribe(
            (projects) => {
                if (projects.length === 0) {
                    this.isEmpty = true;
                }
                this.loadEnd = true;
                this.projects = projects;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEnd = true;
            }
        );
    }

    openDialog() {
        const dialogRef = this.dialog.open(ProjectFormComponent, {
            data: new Project('', '', [new Group('', '', '')] )
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.projects.push(result.project);
                    this.isEmpty = false;
                    break;
                case Constant.MODIFY_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onEdit(project: Project) {
        const dialogRef = this.dialog.open(ProjectFormComponent, {
            data: project
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.projects = this.projects.filter(value => {
                        if (value.keyy !== result.project.keyy) {
                            return value;
                        }
                    });
                    this.projects.push(result.project);
                    break;
                case Constant.MODIFY_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onDelete(project: Project) {
        const dialogRef = this.dialog.open(DeleteProjectComponent, {
            data: project
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.projects = this.projects.filter(value => {
                        if (value.keyy !== result.key) {
                            return value;
                        }
                    });
                    if (this.projects.length === 0) {
                        this.isEmpty = true;
                    }
                    break;
                case Constant.DELETE_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
            }
        });
    }

    onRemoveGroupProject (group: Group, project: Project) {
        if (this.user.type !== 'Admin') {
            return;
        }
        const dialogRef = this.dialog.open(DeleteGroupProjectComponent, {
            data: {project: project, group: group}
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    this.projects = this.projects.filter(value => {
                        if (value.keyy === result.projectKey) {
                            value.group = value.group.filter(
                                value2 => {
                                    if (value2.keyy !== result.groupKey) {
                                        return value2;
                                    }
                                }
                            );
                        }
                        return value;
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
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../model/project';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {UserFormComponent} from '../../user/user-form/user-form.component';
import {Group} from '../../model/group';
import {GroupService} from '../../services/group.service';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-project-from',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
    submitted = false;
    error = '';
    project: Project;
    groups: Group[] = [];
    projectForm: FormGroup;
    isSelected = false;
    isEmpty = false;
    loadEnd = false;
    submitting = false;

    constructor(public dialogRef: MatDialogRef<UserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: Project,
                private projectService: ProjectService, private formBuilder: FormBuilder, private groupService: GroupService) {
        this.project = data;
        this.initForm();
    }

    ngOnInit() {
        this.getGroups();
    }
    getGroups() {
        if (this.project.keyy === '') {
            this.groupService.getGroups().subscribe(
                (groups) => {
                    if (groups.length === 0) {
                        this.isEmpty = true;
                    }
                    this.groups = groups;
                },
                error => {
                    this.error = 'Une erreur est survenue';
                    this.loadEnd = true;
                },
                () => this.loadEnd = true
            );
        } else {
            this.groupService.otherGroupProject(this.project.keyy).subscribe(
                (groups) => {
                    if (groups.length === 0) {
                        this.isEmpty = true;
                    }
                    this.groups = groups;
                },
                error => {
                    this.error = 'Une erreur est survenue';
                    this.loadEnd = true;
                },
                () => this.loadEnd = true
            );
        }
    }
    initForm() {
        this.projectForm = this.formBuilder.group(
            {
                name: [this.project.name, Validators.required],
                groups: new FormArray([])
            }
        );
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.projectForm.invalid) {
            return;
        }
        this.submitting = true;
        const formValue: Project = this.projectForm.value;
        formValue.keyy = this.project.keyy;
        this.projectService.add(formValue).subscribe( (data) => {
                if (data.status === 0) {
                    this.project = data.project;
                    this.dialogRef.close({status: Constant.MODIFY_SUCCESS, project: data.project, mes: data.mes});
                } else {
                    this.error = data.mes;
                }
            },
            () => {this.error = 'Une erreur est survenue'; },
            () => this.submitting = false
        );
        console.log(formValue);
    }
    onCancel(): void {
        this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
    }
    onCheckChange(event) {
        const formArray: FormArray = this.projectForm.get('groups') as FormArray;
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
}

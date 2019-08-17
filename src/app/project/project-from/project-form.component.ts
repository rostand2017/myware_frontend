import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Project} from '../../model/project';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {UserFormComponent} from '../../user/user-form/user-form.component';
import {Group} from '../../model/group';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-project-from',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
    submitted = false;
    error = '';
    project: Project;
    groups: Group[];
    projectForm: FormGroup;
    isSelected = false;

    constructor(public dialogRef: MatDialogRef<UserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: Project,
                private projectService: ProjectService, private formBuilder: FormBuilder, private groupService: GroupService) {
        this.project = data;
    }

    ngOnInit() {
        this.getGroups();
        this.initForm();
    }
    getGroups() {
        this.groups = this.groupService.getGroups();
    }
    initForm() {
        this.projectForm = this.formBuilder.group(
            {
                name: [this.project.name, Validators.required],
                groups: new FormArray([])
            }
        );
        const formArray: FormArray = this.projectForm.get('groups') as FormArray;
        this.project.group.forEach((group => {
            formArray.push(new FormControl(group.keyy));
        }));
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.projectForm.invalid) {
            return;
        }
        const formValue: Project = this.projectForm.value;
        formValue.keyy = this.project.keyy;
        this.projectService.add(formValue).subscribe( (project: Project) => {} /* this.user = user*/,
            () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
        );
        console.log(formValue);
    }
    onCancel(): void {
        this.dialogRef.close();
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

    selected(group: Group): boolean {
       this.isSelected = false;
      this.project.group.forEach((_group: Group) => {
        if ( _group.keyy === group.keyy ) {
          this.isSelected = true;
          return ;
        }
      });
      return this.isSelected;
    }
}

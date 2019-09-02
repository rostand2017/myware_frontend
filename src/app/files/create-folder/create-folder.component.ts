import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../model/constant';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Folder} from '../../model/folder';
import {FileService} from '../../services/file.service';
import {File} from '../../model/file';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {
    submitted = false;
    submitting = false;
    error = '';
    file: any;
    parentKey: String;
    fileForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<CreateFolderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private fileService: FileService, private formBuilder: FormBuilder) {
        this.file = data.file;
        this.parentKey = data.parentKey;
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.fileForm = this.formBuilder.group(
            {
                name: [this.file.name, Validators.required],
            }
        );
    }
    onSubmitForm() {
        this.submitted = true;
        this.error = '';
        if (this.fileForm.invalid) {
            return;
        }
        if (this.file.extension) {
            const formValue: File = this.fileForm.value;
            this.file.name = formValue.name;
            const formData = new FormData();
            formData.append('name', this.file.name);
            formData.append('keyy', this.file.keyy);
            this.fileService.addFile(formData).subscribe( (data) => {
                    if (data.status === 0) {
                        this.file = data.file;
                        this.dialogRef.close({status: Constant.MODIFY_SUCCESS, file: data.file, mes: data.mes});
                    } else {
                        this.error = data.mes;
                    }
                } ,
                () => {this.error = 'Une erreur est survenue'; },
                () => this.submitting = false
            );
        } else {
            const formValue: Folder = this.fileForm.value;
            formValue.keyy = this.file.keyy;
            this.fileService.addFolder(formValue, this.parentKey).subscribe( (data) => {
                    if (data.status === 0) {
                        this.file = data.folder;
                        this.dialogRef.close({status: Constant.MODIFY_SUCCESS, file: data.folder, mes: data.mes});
                    } else {
                        this.error = data.mes;
                    }
                },
                () => {this.error = 'Une erreur est survenue'; },
                () => this.submitting = false
            );
            console.log(formValue);
        }
    }
    onCancel(): void {
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }}

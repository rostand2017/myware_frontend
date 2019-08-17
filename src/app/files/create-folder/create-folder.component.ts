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
            this.fileService.addFile(this.file, this.parentKey).subscribe( (file: File) => {} /* this.user = user*/,
                () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
            );
            console.log(this.file);
        } else {
            const formValue: Folder = this.fileForm.value;
            formValue.keyy = this.file.keyy;
            this.fileService.addFolder(formValue, this.parentKey).subscribe( (folder: Folder) => {} /* this.user = user*/,
                () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
            );
            console.log(formValue);
        }
    }
    onCancel(): void {
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }}

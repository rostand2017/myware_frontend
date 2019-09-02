import {Component, Inject, OnInit} from '@angular/core';
import {Constant} from '../../model/constant';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FileService} from '../../services/file.service';

@Component({
  selector: 'app-delete-file',
  templateUrl: './delete-file.component.html',
  styleUrls: ['./delete-file.component.css']
})
export class DeleteFileComponent implements OnInit {
    constructor(
        private fileService: FileService,
        public dialogRef: MatDialogRef<DeleteFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onDelete(): void {
        if ( this.data.type === 'folder' ) {
            this.fileService.deleteFolder(this.data.file).subscribe(
                (data) => {
                    if (data.status === 0 ) {
                        this.dialogRef.close( {key: this.data.file.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
                (error) => this.dialogRef.close(Constant.MESSAGE_OK)
            );
        } else {
            this.fileService.deleteFile(this.data.file.keyy).subscribe(
                (data) => {
                    if (data.status === 0 ) {
                        this.dialogRef.close( {key: this.data.file.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
                (error) => this.dialogRef.close(Constant.MESSAGE_OK)
            );
        }
    }
    ngOnInit() {
    }
}

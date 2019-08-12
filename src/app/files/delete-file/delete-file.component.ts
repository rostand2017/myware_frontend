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
                (folder) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Dossier supprimé'); },
                (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); }
            );
        } else {
            this.fileService.deleteFile(this.data.file).subscribe(
                (file) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Fichier supprimé'); },
                (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); }
            );
        }
    }
    ngOnInit() {
    }
}

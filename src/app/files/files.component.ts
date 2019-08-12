import { Component, OnInit } from '@angular/core';
import {Group} from '../model/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupFromComponent} from '../group/group-from/group-from.component';
import {MatDialog} from '@angular/material';
import {File} from '../model/file';
import {Folder} from '../model/folder';
import {FileService} from '../services/file.service';
import {Location} from '@angular/common';
import {CreateFolderComponent} from './create-folder/create-folder.component';
import {DeleteFileComponent} from './delete-file/delete-file.component';
import {ShareComponent} from './share/share.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

    files: [Folder[], File[]];
    folder: Folder = new Folder('', '', [], [], '');
    folderKey = '';
    constructor(public dialog: MatDialog, private fileService: FileService, private router: ActivatedRoute, private location: Location) { }

    ngOnInit() {
        this.getFiles();
    }
    getFiles() {
        this.folderKey = this.router.snapshot.paramMap.get('folderKey');
        this.files = this.fileService.getFilesAndFolders(this.folderKey);
    }

    openDialog(file: any) {
        const dialogRef = this.dialog.open(CreateFolderComponent, {
            data: {parentKey: this.folderKey, file: file}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getGroups
        });
    }
    onShare(file: any) {
        const dialogRef = this.dialog.open(ShareComponent, {
            data: file
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed ' + result );
            // dialog closed.If submission is ok, call getGroups
        });
    }

    onEdit(group: Group) {
        const dialogRef = this.dialog.open(GroupFromComponent, {
            data: group
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getGroups
        });
    }

    onDeleteFile(file: File, type: String) {
        const dialogRef = this.dialog.open(DeleteFileComponent, {
            data: {type: type, file: file}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // dialog closed.If submission is ok, call getGroups
        });
    }
    onBack() {
      this.location.back();
    }
    isDisabled(): boolean {
        const id = this.router.snapshot.paramMap.get('folderKey');
        return !id;
    }
}

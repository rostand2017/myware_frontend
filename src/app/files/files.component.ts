import { Component, OnInit } from '@angular/core';
import {Group} from '../model/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupFromComponent} from '../group/group-from/group-from.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {File} from '../model/file';
import {Folder} from '../model/folder';
import {FileService} from '../services/file.service';
import {Location} from '@angular/common';
import {CreateFolderComponent} from './create-folder/create-folder.component';
import {DeleteFileComponent} from './delete-file/delete-file.component';
import {ShareComponent} from './share/share.component';
import {Constant} from '../model/constant';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

    breadCrumbFolders: Folder[] = [];
    files: File[] = [];
    folders: Folder[] = [];
    folder = new Folder('', '', '');
    currentFolder = new Folder('', '', '');
    rootFolder = new Folder('', '/', '');
    folderKey: String = '';
    error = '';
    isEmptyFiles = false;
    isEmptyFolders = false;
    loadEndFiles = false;
    loadEndFolders = false;
    loadEndUpload = true;
    constructor(public dialog: MatDialog, private fileService: FileService, private router: ActivatedRoute,
                private location: Location, private snackBar: MatSnackBar, private sanitizer: DomSanitizer) {
        this.folderKey = this.router.snapshot.paramMap.get('folderKey');
    }

    ngOnInit() {
        this.getFolders();
        this.getFiles();
    }
    getFiles() {
        this.files = [];
        this.fileService.getFiles(this.folderKey).subscribe(
            (files) => {
                if (files.length === 0) {
                    this.isEmptyFiles = true;
                }
                this.loadEndFiles = true;
                this.files = files;
                this.files.forEach((file) => {
                    if (file.extension.toLowerCase() === 'jpg' || file.extension.toLowerCase() === 'png'
                        || file.extension.toLowerCase() === 'jpeg' ) {
                        this.fileService.downloadThumbnail(file.link).subscribe(
                            value => {
                                file.thumbnail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
                            },
                            error2 => {
                                console.log('error2: ');
                            }
                        );
                    }
                });
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEndFiles = true;
            }
        );
    }

    getFolders() {
        this.folders = [];
        this.fileService.getFolders(this.folderKey).subscribe(
            (folders) => {
                if (folders.length === 0) {
                    this.isEmptyFolders = true;
                }
                this.loadEndFolders = true;
                this.folders = folders;
            },
            error => {
                this.error = 'Une erreur est survenue';
                this.loadEndFolders = true;
            }
        );
    }

    openFolder(folder: Folder, isBreadcrumb = false) {
        this.location.replaceState('/files/' + folder.keyy);
        this.error = '';
        this.isEmptyFiles = false;
        this.isEmptyFolders = false;
        this.loadEndFiles = false;
        this.loadEndFolders = false;
        this.folderKey = folder.keyy;
        this.currentFolder = folder;
        this.getFolders();
        this.getFiles();
        if (!isBreadcrumb) {
            this.breadCrumbFolders.push(folder);
        } else {
            let end = false;
            if (folder.keyy !== '') {
                this.breadCrumbFolders = this.breadCrumbFolders.filter(
                    (_folder) => {
                        if (folder.keyy === _folder.keyy) {
                            end = true;
                        }
                        if (!end) {
                            return _folder;
                        }
                    }
                );
                this.breadCrumbFolders.push(folder);
            } else {
                this.breadCrumbFolders = [];
            }
        }
    }

    openDialog(file: any) {
        const dialogRef = this.dialog.open(CreateFolderComponent, {
            data: {parentKey: this.folderKey, file: file}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            switch (result.status) {
                case Constant.MODIFY_FAILED:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    break;
                case Constant.MODIFY_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    if (result.file.extension) {
                        this.files = this.files.filter(value => {
                            if (value.keyy !== result.file.keyy) {
                                return value;
                            }
                        });
                        this.files.push(result.file);
                    } else {
                        this.folders = this.folders.filter(value => {
                            if (value.keyy !== result.file.keyy) {
                                return value;
                            }
                        });
                        this.folders.push(result.file);
                    }
                    break;
            }
        });
    }

    onShare(file: any) {
        const dialogRef = this.dialog.open(ShareComponent, {
            data: file
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            if (result.status === Constant.SHARE_SUCCESS) {
                this.snackBar.open(result.mes, 'ok', {
                    duration: 2000,
                });
            }
        });
    }

    onDeleteFile(file: any, type: String) {
        const dialogRef = this.dialog.open(DeleteFileComponent, {
            data: {type: type, file: file}
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result.status) {
                case Constant.DELETE_SUCCESS:
                    this.snackBar.open(result.mes, 'ok', {
                        duration: 2000,
                    });
                    if (type === 'folder') {
                        this.folders = this.folders.filter(value => {
                            if (value.keyy !== result.key) {
                                return value;
                            }
                        });
                    } else {
                        this.files = this.files.filter(value => {
                            if (value.keyy !== result.key) {
                                return value;
                            }
                        });
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

    isDisabled(folder: Folder): boolean {
        return (this.currentFolder.keyy !== '' && folder.keyy === this.currentFolder.keyy);
    }

    onFileInput(event) {
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            let data: FormData = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append(i.toString(), files[i], files[i].name);
            }
            data.append('folderKey', this.currentFolder.keyy.toString());
            data.append('keyy', '');
            data.append('name', '');
            this.loadEndUpload = false;
            this.fileService.addFile(data).subscribe(
                value => {
                    this.snackBar.open(value.mes, 'ok', {
                        duration: 2000,
                    });
                    if (value.status === 1 ) {
                        return;
                    }
                    for (let i = 0; i < value.files.length; i++) {
                        this.files.push(value.files[i]);
                    }
                    data = null;
                },
                    error => {
                        this.snackBar.open('Une erreur est survenue', 'ok', {
                            duration: 2000,
                        });
                        this.loadEndFolders = true;
                        this.loadEndUpload = true;
                    },
                () => {
                    this.loadEndFolders = true;
                    this.loadEndUpload = true;
                }
            );
        }
    }

    downloadFile(link: String) {
        this.fileService.downloadFile(link).subscribe(
            value => {
                window.open(URL.createObjectURL(value));
                console.log('download end');
            },
            error2 => {
                console.log('error2: ');
            }
        );
    }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../model/group';
import {GroupService} from '../../services/group.service';
import {DeleteUserComponent} from '../../user/delete-user/delete-user.component';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.css']
})
export class RemoveUserComponent implements OnInit {
    constructor(
        private groupService: GroupService,
        public dialogRef: MatDialogRef<RemoveUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close(Constant.MESSAGE_BAD);
    }
    onRemoveUser(): void {
        this.groupService.removeMember(this.data.user.key, this.data.groupKey).subscribe(
            () => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Membre retiré'); },
            () => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); } );
    }
    ngOnInit() {
    }

}

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
        this.groupService.removeMember(this.data.user.keyy, this.data.groupKey).subscribe(
            (data) => {
                    if (data.status === 0) {
                        this.dialogRef.close({status: Constant.DELETE_SUCCESS, mes: data.mes});
                    } else {
                        this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
                    }
                },
            () => {
                this.dialogRef.close({status: Constant.DELETE_FAILED, mes: 'Une erreur est survenue'});
            } );
    }
    ngOnInit() {
    }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DeleteUserComponent} from '../../user/delete-user/delete-user.component';
import {Constant} from '../../model/constant';
import {Group} from '../../model/group';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css']
})
export class DeleteGroupComponent implements OnInit {

  constructor(
      private groupService: GroupService,
      public dialogRef: MatDialogRef<DeleteUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Group) {}

  onNoClick(): void {
      this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
  }
  onDeleteGroup(): void {
      this.groupService.delete(this.data.keyy).subscribe(
          (data) => {
              if (data.status === 0 ) {
                  this.dialogRef.close( {key: this.data.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
              } else {
                  this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
              }
          },
          (error) => { this.dialogRef.close(Constant.MESSAGE_OK); } );
  }

  ngOnInit() {
  }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {Constant} from '../../model/constant';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  constructor(
      private userService: UserService,
      public dialogRef: MatDialogRef<DeleteUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: User) {}

  onNoClick(): void {
      this.dialogRef.close({status: Constant.OPERATION_CANCELLED});
  }
  onDeleteUser(): void {
    this.userService.delete(this.data.keyy).subscribe(
        (data) => {
            if (data.status === 0 ) {
                this.dialogRef.close( {key: this.data.keyy, status: Constant.DELETE_SUCCESS, mes: data.mes});
            } else {
                this.dialogRef.close({status: Constant.DELETE_FAILED, mes: data.mes});
            }
          },
        (error) => { this.dialogRef.close({status: Constant.DELETE_FAILED, mes: 'Une erreur est survenue'});
        } );
  }

  ngOnInit() {
  }

}

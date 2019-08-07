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
      this.dialogRef.close();
  }
  onDeleteUser(): void {
    this.userService.delete(this.data).subscribe(
        (user) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('utilisateur supprimé'); },
        (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('une erreur est survenue'); } );
  }

  ngOnInit() {
  }

}
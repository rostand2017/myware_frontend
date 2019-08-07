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
      this.dialogRef.close(Constant.MESSAGE_BAD);
  }
  onDeleteGroup(): void {
      this.groupService.delete(this.data).subscribe(
          (group) => {this.dialogRef.close(Constant.MESSAGE_OK); console.log('Groupe supprimé'); },
          (error) => { this.dialogRef.close(Constant.MESSAGE_OK); console.log('Une erreur est survenue'); } );
  }

  ngOnInit() {
  }

}

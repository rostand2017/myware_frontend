import {Component, OnInit} from '@angular/core';
import {GroupService} from '../services/group.service';
import {Group} from '../model/group';
import {MatDialog} from '@angular/material';
import {GroupFromComponent} from './group-from/group-from.component';
import {DeleteGroupComponent} from './delete-group/delete-group.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[];

  constructor(public dialog: MatDialog, private groupService: GroupService) { }

    ngOnInit() {
      this.getGroups();
    }
    getGroups() {
        this.groups = this.groupService.getGroups();
    }

    openDialog(group: Group) {
        const dialogRef = this.dialog.open(GroupFromComponent, {
        data: group
        });
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
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
    onDelete(group: Group) {
        const dialogRef = this.dialog.open(DeleteGroupComponent, {
        data: group
        });
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // dialog closed.If submission is ok, call getGroups
        });
    }
}

import {Component, OnInit} from '@angular/core';
import {GroupService} from '../services/group.service';
import {Group} from '../model/group';
import {MatDialog} from '@angular/material';
import {GroupFromComponent} from './group-from/group-from.component';
import {DeleteGroupComponent} from './delete-group/delete-group.component';
import {Router} from '@angular/router';
import {User} from '../model/user';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[];
  group: Group;

  constructor(public dialog: MatDialog, private groupService: GroupService, private router: Router) { }

    ngOnInit() {
      this.getGroups();
    }
    getGroups() {
        this.groups = this.groupService.getGroups();
        // alert(this.groups[0].name);
    }

    openDialog() {
        const dialogRef = this.dialog.open(GroupFromComponent, {
            data: new Group('', '', '')
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

    onDelete(group: Group) {
        const dialogRef = this.dialog.open(DeleteGroupComponent, {
        data: group
        });
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // dialog closed.If submission is ok, call getGroups
        });
    }
    onDiscussion(group: Group) {
      this.router.navigate(['discussion/' + group.keyy]);
    }
}

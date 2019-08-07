import { Component, OnInit } from '@angular/core';
import {Group} from '../../model/group';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-group-from',
  templateUrl: './group-from.component.html',
  styleUrls: ['./group-from.component.css']
})
export class GroupFromComponent implements OnInit {
  submitted = false;
  error = '';
  group: Group;
  groupForm: FormGroup;

    constructor(private groupService: GroupService, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.initForm();
  }

  initForm() {
      this.groupForm = this.formBuilder.group(
          {
              name: [this.group.name, Validators.required],
              description: [this.group.name, Validators.required],
          }
      );
  }
  onSubmitForm() {
      this.submitted = true;
      this.error = '';
      if (this.groupForm.invalid) {
          return;
      }
      const formValue: Group = this.groupForm.value;
      formValue.key = this.group.key;
      this.groupService.add(formValue).subscribe( (group: Group) => {} /* this.user = user*/,
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur'; }
      );
      console.log(formValue);
  }
}

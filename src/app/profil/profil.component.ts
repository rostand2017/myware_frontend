import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../services/user.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {FileService} from '../services/file.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: User = new User('', '', '', '', '', '', '', '', '');
  userForm: FormGroup;
  submitted = false;
  submitting = false;
  error = '';
  success = '';
  loadEnd = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private fileService: FileService) { }

  ngOnInit() {
      this.initForm();
      this.getUser();
  }
  getUser () {
    this.userService.getCurrentUser().subscribe( user => {
            this.user = user;
            this.initForm();
            this.loadEnd = true;
            if (!user.image) {
                return;
            }
            this.fileService.downloadThumbnail(user.image).subscribe(
                value => {
                    this.user.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
                }
            );
        },
        (error) => {
            this.error = 'Une erreur est survenue';
            this.loadEnd = true;
        }
    );
  }
  initForm() {
      this.userForm = this.formBuilder.group(
          {
              name: [this.user.name, Validators.required],
              fonction: [this.user.fonction, Validators.required],
              type: [this.user.type, Validators.required],
              tel: [this.user.tel, [Validators.required, Validators.pattern('[0-9]{8,12}')]],
              email: [this.user.email, [Validators.required, Validators.email]],
              password: [''],
              subname: [this.user.subname],
          }
      );
  }
  onSubmitForm() {
      this.submitted = true;
      this.error = '';
      this.success = '';
      if (this.userForm.invalid) {
          return;
      }
      this.submitting = true;
      const formValue: User = this.userForm.value;
      formValue.keyy = this.user.keyy;
      this.userService.modifyMe(formValue).subscribe( (data) => {
            if (data.status === 0 ) {
                this.success = data.mes;
                this.user = data.user;
                this.initForm();
            } else {
                this.error = data.mes;
            }
          },
          () => { console.log('Une erreur est survenue'); this.error = 'Une erreur est survenue'; },
          () => this.submitting = false
      );
      console.log(formValue);
  }

  onFileInput(event) {
    if (event.target.files && event.target.files.length > 0) {
        this.loadEnd = false;
        const files = event.target.files;
        const data: FormData = new FormData();
        data.append('photo', files[0], files[0].name);
        this.userService.uploadPhoto(data).subscribe(
            value => {
                this.snackBar.open(value.mes, 'ok', {
                    duration: 2000,
                });
                if (value.status === 0) {
                    this.user.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]));
                }
            },
            error => {
                this.snackBar.open('Une erreur est survenue', 'ok', {
                    duration: 2000,
                });
                this.loadEnd = true;
            },
            () => {
                this.loadEnd = true;
            }
        );
    }
  }

}

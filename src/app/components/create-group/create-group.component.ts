import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import {Router} from '@angular/router';
import {InitialGroup} from 'src/app/models/group';
import {GroupService} from 'src/app/services/group/group.service';
import {Observable} from 'rxjs';
import {AuthService} from 'src/app/services/auth/auth.service';
import {LocalStorageService} from 'src/app/services/localStorage/local-storage.service';
import {NgForm} from '@angular/forms';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('createGroup') form: NgForm;
  groupSettings = InitialGroup;
  userUid;
  accessToken: string = '';
  currentPage = 1;
  selectedIndex: number;
  albums$: Observable<Album[]>;

  constructor(
    protected modalService: ModalService,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private storage: LocalStorageService,
    private albumService: AlbumService,
    private toast: ToastService 
  ) {}

  ngOnInit() {
    // this.authService.user$.subscribe(user => (this.userUid = user.uid));
    this.userUid = this.storage.getStorage('user_uid');
    this.userUid = this.userUid.source.value;
    this.albums$ = this.albumService.getAllAlbums();
  }


  formNextStep() {
    if(this.groupSettings.albumUid == ''){
      this.toast.newToast({
        content : "Select associated album for this group.",
        style : "warning"
      });
    } else {
      this.groupSettings.userUid = this.userUid;
      this.groupSettings.accessCode = this.accessToken;
      this.groupService.createGroup(this.groupSettings).then(() => {
        this.groupSettings = InitialGroup;
        this.groupSettings.albumUid = '';
        this.router
          .navigateByUrl('/albums')
          .then(() => {
            this.form.resetForm();
            this.modalService.closeModal()
          });
      });
    }
  }

  closeModal() {
    this.groupSettings = InitialGroup;
    this.groupSettings.albumUid = '';
    this.modalService.closeModal();
  }

  generateAccessCode(val) {
    if(val) {
      const possible = "0123456789";
      for (var i = 0; i < 4; i++)
        this.accessToken += possible.charAt(Math.floor(Math.random() * possible.length));
    } else {
      this.accessToken = '';
    }
  }

  selectAlbum(album:Album, idx) {
    this.selectedIndex = idx;
    this.groupSettings.albumUid = album.albumUid;
  }
}

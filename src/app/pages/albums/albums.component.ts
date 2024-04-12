import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import { AlbumService } from '../../services/album/album.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';
import {User} from 'src/app/models/User';
import {GroupService} from 'src/app/services/group/group.service';
import {switchMap, tap, map} from 'rxjs/operators';
import {Group} from 'src/app/models/group';
import {ToastService} from 'src/app/services/toast/toast.service';
import { UserService } from '../../services/user/user.service';
import { Album } from '../../models/album';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit {
  user$: Observable<firebase.User>;
  user: any = {};
  albums: any = [];
  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private groupService: GroupService,
    private albumService: AlbumService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.getUser();
    this.getAlbums();
    // this.user$ = this.authService.user$;
    // if (this.user$) {
    //   this.user$
    //     .pipe(map((user: firebase.User) => this.checkInvitations(user.email)))
    //     .subscribe();
    // }
  }

  async getUser() {
    try {
      this.user = await this.userService.getProfile();
    } catch(e) {

    }
  }

  async getAlbums() {
    try {
      this.user = await this.userService.getProfile();
      if(this.user['album_one_id']) this.albums[0] = await this.albumService.getAlbumItem(this.user['album_one_id']);
      if(this.user['album_two_id']) this.albums[1] = await this.albumService.getAlbumItem(this.user['album_two_id']);
      if(this.user['album_three_id']) this.albums[2] = await this.albumService.getAlbumItem(this.user['album_three_id']);
    } catch(e) {
    }
  }

  checkInvitations(email) {
    this.groupService.checkIfEmailExists(email).subscribe(groups =>
      groups.forEach((group: Group) => {
        const alert = confirm(
          `You have invitations for group ${
            group.name
          }. Do You accept invitation?`
        );
        if (alert === true) {
          this.groupService.updateStatus(group.groupUid, email, 'accepted');
        } else {
          this.groupService.updateStatus(group.groupUid, email, 'canceled');
        }
      })
    );
  }

  openGroupsModal(modalType) {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: modalType},
    });
  }

  async openModal(album, modalType, index) {
    try {
      if(index == 0) {
        if(new Date(this.user['album_one_lastVisit']).getMonth() == new Date().getMonth() && new Date(this.user['album_one_lastVisit']).getDate() == new Date().getDate()) {
          this.router.navigate(['/album/' + this.user['album_one_id']]);
          return;
        } else {
          this.modalService.modalShow({
            modalShow: true,
            modalData: {
              album: album,
              userAlbumIndex: 0
            },
            modalContent: {modalType: modalType},
          });
        }
      } else if(index == 1) {
        if(new Date(this.user['album_two_lastVisit']).getMonth() == new Date().getMonth() && new Date(this.user['album_two_lastVisit']).getDate() == new Date().getDate()) {
          this.router.navigate(['/album/' + this.user['album_two_id']]);
          return;
        } else {
          this.modalService.modalShow({
            modalShow: true,
            modalData: {
              album: album,
              userAlbumIndex: 1
            },
            modalContent: {modalType: modalType},
          });
        }
      } else if(index == 2) {
        if(new Date(this.user['album_three_lastVisit']).getMonth() == new Date().getMonth() && new Date(this.user['album_three_lastVisit']).getDate() == new Date().getDate()) {
          this.router.navigate(['/album/' + this.user['album_three_id']]);
          return;
        } else {
          this.modalService.modalShow({
            modalShow: true,
            modalData: {
              album: album,
              userAlbumIndex: 2
            },
            modalContent: {modalType: modalType},
          });
        }
      }
    } catch(e) {

    }

  }
}

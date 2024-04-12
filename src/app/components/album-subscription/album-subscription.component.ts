import {Component, OnInit} from '@angular/core';
import {ModalService} from 'src/app/services/modal.service';
import {UserService} from 'src/app/services/user/user.service';
import {DataService} from 'src/app/services/data/data.service';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';

@Component({
  selector: 'app-album-subscription',
  templateUrl: './album-subscription.component.html',
  styleUrls: ['./album-subscription.component.scss'],
})
export class AlbumSubscriptionComponent implements OnInit {
  album: Album;

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private dataService: DataService
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalService.closeModal();
  }

  subscribeToAlbum() {
    this.dataService.currentAlbum.subscribe(album => {
      this.album = album;
      this.userService.addAlbumUid(this.album.albumUid);
    });
  }
}

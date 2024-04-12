import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AlbumService } from '../../services/album/album.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  users:any = [];
  albumId: any;
  user: any = {};
  index: any;
  album: any = {};

  constructor(private activatedRoute: ActivatedRoute, 
    private albumService: AlbumService,
    private usersService: UserService) {

    this.albumId = this.activatedRoute.snapshot.params['id'];
   }

  async ngOnInit() {
    await this.getUser();
    await this.getAlbum();
    await this.getUsers();
  }

  async getUser() {
    this.user = await this.usersService.getProfile();
  }

  async getAlbum() {
    this.album = await this.albumService.getAlbumItem(this.albumId);
    console.log('album', this.album);
  }

  goBack() {
    window.history.back();
  }

  async getUsers() {
    if(this.user['album_one_id'] == this.albumId) {
      this.index = 0;
    } else if(this.user['album_two_id'] == this.albumId) {
      this.index = 1;
    } else if(this.user['album_three_id'] == this.albumId) {
      this.index = 2;
    }
    this.users = await this.usersService.getUsersByAlbum(this.index, this.albumId);
    if(this.user['album_one_id'] == this.albumId) {
      this.users.sort( (a, b) => (a.album_one_points < b.album_one_points) ? 1 : (b.album_one_points < a.album_one_points) ? -1 : 0);
    } else if(this.user['album_two_id'] == this.albumId) {
      this.users.sort( (a, b) => (a.album_two_points < b.album_two_points) ? 1 : (b.album_two_points < a.album_two_points) ? -1 : 0);
    } else if(this.user['album_three_id'] == this.albumId) {
      this.users.sort( (a, b) => (a.album_three_points < b.album_three_points) ? 1 : (b.album_three_points < a.album_three_points) ? -1 : 0);
    }
  }

}

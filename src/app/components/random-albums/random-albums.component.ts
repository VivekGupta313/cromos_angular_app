import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import {DataService} from 'src/app/services/data/data.service';
import {AlbumService} from 'src/app/services/album/album.service';
import {take, bufferCount, first} from 'rxjs/operators';
import {ImageService} from 'src/app/services/image/image.service';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {Image} from 'src/app/models/image';
import {UtilityService} from 'src/app/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random-albums',
  templateUrl: './random-albums.component.html',
  styleUrls: ['./random-albums.component.scss'],
})
export class RandomAlbumsComponent implements OnInit {
  albums: any = [];
  images: any;
  loaded = false;
  rndAlbum: Album;
  lastVisible;
  color = "green";
  constructor(
    private modalService: ModalService,
    private albumService: AlbumService,
    private imageService: ImageService,
    private utility: UtilityService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getAlbums();
  
    // this.albumService.getAllAlbums().subscribe(albums => {
    //   this.rndAlbum = this.utility.getRandom(albums, 1)[0];
    //   this.dataService.changeAlbum(this.rndAlbum);

    //   if (albums.length >= 5) {
    //     this.albums = this.utility.getRandom(albums, 5);
    //   } else {
    //     this.albums = this.utility.getRandom(albums, albums.length);
    //   }
    //   this.albums.forEach(album => {
    //     this.imageService.getRandomImageFromAlbum(album).subscribe(image => {
    //       album.url = image[0].url;
    //     });
    //   });
    // });
  }

  goToAlbum(album) {
    this.router.navigate(['/album/' + album.albumUid]);
  }

  async getAlbums() {
    this.albums = await this.albumService.list();

    await this.albums.forEach( e =>{
       
       this.albumService.getAlbumCollectionDetail(e.collection).forEach(ec=>{


          e["color"] = ec['0']==undefined? "green" : ec['0'].color;
       })
    })

    console.log('albums', this.albums);
  }

  openModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'auth'},
    });
  }
}

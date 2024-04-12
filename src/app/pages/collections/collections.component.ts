import {Component, OnInit, Testability} from '@angular/core';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ImageService} from 'src/app/services/image/image.service';
import {Image} from 'src/app/models/image';
import {DataService} from 'src/app/services/data/data.service';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Collection} from 'src/app/models/collections';
import {CollectionService} from 'src/app/services/collection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  randomImage: any;
  images: Image[];
  albums: any = [];
  collections: any = [];
  classes = [
    'color-blue',
    'color-violet',
    'color-green',
    'color-lemon',
    'color-orange',
    'color-red',
    'color-pink',
    'color-d_red'
  ];
  constructor(
    private albumService: AlbumService,
    private imageService: ImageService,
    private dataService: DataService,
    private router: Router,
    private collection: CollectionService
  ) {}

  ngOnInit() {
    this.getColletions();
    this.getAllAlbums();
    
    // this.albumService.getAllAlbums().subscribe((albums: Album[]) => {
    //   this.albums = albums.filter((album: Album) => album.nrOfCards > 0);
    //   console.log('albums', this.albums);
    // });
    this.imageService
      .getAllImages()
      .pipe(first())
      .subscribe((images: Image[]) => {
        // this.albums = albums;
        // this.randomAlbum = this.albumService.getRandomAlbum(albums);
        this.images = images;
        this.dataService.changeImage(images);
        this.randomImage = this.imageService.getRndImage(images);
      });
  }

  openAlbum(album) {
    this.router.navigate([`album/${album.name}`]);
  }
 
  async selectCollection(collection) {
    try {
      console.log('collection', collection);
      this.albums = await this.albumService.listByCollection(collection.collection);
    } catch(e) {

    }
  }

  async getColletions() {
    try {
      this.collections = await this.collection.getCollections();
      console.log('collections', this.collections);
    } catch(e) {

    }
  }

  async getAllAlbums() {
    try {
      this.albums = await this.albumService.list();
    } catch(e) {

    }
  }
}

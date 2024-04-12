import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {ImageService} from 'src/app/services/image/image.service';
import {Observable, from, of} from 'rxjs';
import {Image, initialImage} from 'src/app/models/image';
import {GridApi, ColumnApi} from 'ag-grid-community';
import {CardRendererComponent} from './card-renderer.component';
import {COLLECTIONS, Collection} from 'src/app/models/collections';
import {Album, initialAlbum} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {BatchService} from 'src/app/services/batch/batch.service';
import {tap, map, flatMap} from 'rxjs/operators';
import {AlbumCards} from 'src/app/models/albumcards';
import {combineLatest} from 'rxjs';
import {NgForm} from '@angular/forms';
import {CollectionService} from 'src/app/services/collection.service';

@Component({
  selector: 'app-manage-images',
  templateUrl: './manage-images.component.html',
  styleUrls: ['./manage-images.component.scss'],
})
export class ManageImagesComponent implements OnInit {
  images$: Observable<Image[]>;
  collections$: Observable<Collection[]>;

  cols;
  @ViewChild('f') form: NgForm;
  @ViewChild('selColl') selColl: HTMLSelectElement;
  private api: GridApi;
  private columnApi: ColumnApi;
  frameworkComponents;
  context;
  imagesColumns;
  delete;
  addToAlbum;
  albumColumns;
  deleteAlbum;
  collections;
  collection;
  albumNames;
  albumName;
  albums;
  album: Album = initialAlbum;
  cardsInAlbum: Image[];
  currAlbum: Album = initialAlbum;
  imagesForAlbum$: Observable<any[]>;
  imagesForAlbum = [];
  defaultName: string;
  defaultCollection: string;

  constructor(
    private imageService: ImageService,
    private albumService: AlbumService,
    private albumcards: AlbumcardsService,
    private collectionService: CollectionService
  ) {}

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.images$ = this.imageService.getAllImages();
    this.collection = '';
    this.albumName = '';
    this.albumNames =
      JSON.parse(localStorage.getItem('albumNames') || '') || [];
  }

  getAlbumNames(collection) {
    this.albumService.getAlbumsFromCollection(collection).subscribe(albums => {
      this.albums = albums;
      this.albumNames = albums.map((album: Album) => album.name);
      localStorage.setItem('albumNames', JSON.stringify(this.albumNames));
    });
  }

  getImagesForAlbum(name) {
    console.log("current album",this.album);
    console.log("name",name);
    console.log("current collection",this.collection);
    this.currAlbum = this.albumService.getAlbumFromAlbumArray(
      this.albums,
      name,
      this.collection
    );
    // tslint:disable-next-line:curly
    if (!this.currAlbum) return;

    this.imagesForAlbum$ = this.albumcards
      .getAllCardsForAlbumUid(this.currAlbum.albumUid)
      .pipe(
        map((cards: AlbumCards[]) =>
          cards.map((card: AlbumCards) =>
            this.imageService.getCurrentImage(card).pipe(
              map(image => ({
                ...image,
                nrOfCard: card.nrOfCard,
                albumUid: this.currAlbum.albumUid,
                albumcardsUid: card.albumcardUid,
              }))
            )
          )
        ),
        flatMap(obs => combineLatest(obs))
      );
  }
}

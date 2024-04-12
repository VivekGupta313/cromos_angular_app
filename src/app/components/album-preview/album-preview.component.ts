import {Component, OnInit, Input} from '@angular/core';
import {Album} from 'src/app/models/album';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data/data.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {Observable} from 'rxjs';
import {AlbumService} from 'src/app/services/album/album.service';
import {dummyImage} from '../../models/image';
import {flatMap, map} from 'rxjs/operators';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss'],
})
export class AlbumPreviewComponent implements OnInit {
  @Input()
  album: Album;
  albums: Observable<Album>;
  rndImage$: Observable<any>;
  rndImage: Image;
  images: Image[];
  loaded = false;
  dummyImage = dummyImage;
  collections: any = [];
  color = "green" ; 

  constructor(
    private router: Router,
    private dataService: DataService,
    private imageService: ImageService,
    private albumService: AlbumService,
    private collection: CollectionService
  ) {}

  ngOnInit() {
    // this.dataService.currentImages.subscribe(images => {
    //   this.rndImage = this.imageService.getRndImageForAlbum(images, this.album);
    //   console.log('randomImage:', this.rndImage);
    // });
    this.rndImage$ = this.imageService
      .getRandomImageFromAlbum(this.album)
      .pipe(map(item => item[0]));
      console.log("album") ; 
      console.log(this.album) ; 

      this.getColletions() ;

    

    this.rndImage$.subscribe(image => (this.rndImage = image));
  }
  openAlbum(album) {
    this.router.navigate([`album/${album.albumUid}`]);
    this.dataService.changeAlbum(this.album);
    this.dataService.changeImage([this.rndImage]);
  }

  dosomething() {
    this.loaded = true;
  }

   getColletions() {
    try {
      this.collection.getCollections().then(
        (c) => {
          this.collections =  c ; 

      for(let i = 0 ; i < this.collections.length ; i++){
        if(this.album.collection == this.collections[i].collection){
          this.color = this.collections[i].color ; 
          console.log("color "+this.color) ;
        }
          break; 
      }
        }
      );
      
    } catch(e) {

    }
  }
}

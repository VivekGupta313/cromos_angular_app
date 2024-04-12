import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {take, tap, switchMap, map} from 'rxjs/operators';
import {DataService} from 'src/app/services/data/data.service';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {AlbumCards} from 'src/app/models/albumcards';
import {mapToExpression} from '@angular/compiler/src/render3/view/util';
import {PaginationService} from 'src/app/services/pagination.service';

@Component({
  selector: 'app-interactive-album',
  templateUrl: './interactive-album.component.html',
  styleUrls: ['./interactive-album.component.scss'],
})
export class InteractiveAlbumComponent implements OnInit {
  @Input() inCollection: boolean;
  albums$: Observable<Album[]>;
  rndAlbum$: Observable<Album>;
  rndAlbum: Album;
  images$: Observable<any>;
  images: any;
  imagesSliceLeft: Image[];
  imagesSliceRight: Image[];
  sliceNumber = 0;
  imagesArrayLength: number;
  endOfArray = false;
  beginingOfArray = true;
  showDesc = false;
  selectedIndex: number;
  clicked = false;
  lastCard;
  lastVisible;
  cards1 = [
    {
      url: '../../../assets/Fotos/A1.jpg', 
      nrOfCard: '01', 
      title: 'Esquilache',
      description: 'The Esquilache Riots (Motín de Esquilache) occurred in March 1766 during the rule of Charles III of Spain.',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A10.jpg', 
      nrOfCard: '02', 
      title: 'Lorenzo el Magnífico',
      description: 'Lorenzo de Medici was an Italian statesman, de facto ruler of the Florentine Republic and the most powerful and enthusiastic patron of Renaissance culture in Italy.',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A101.jpg', 
      nrOfCard: '03', 
      title: 'Malinche',
      description: 'La Malinche was a Nahua woman from the Mexican Gulf Coast, who played a key role in the Spanish conquest of the Aztec Empire.',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A102.jpg', 
      nrOfCard: '04', 
      title: 'La Fayette',
      description: 'La Fayette was a French aristocrat and military officer who fought in the American Revolutionary War.',
      isOpened: false
    },
  ];

  cards2 = [
    {
      url: '../../../assets/Fotos/A3.jpg', 
      nrOfCard: '05', 
      title: 'Prim',
      description: 'Spanish general and statesman',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A4.jpg', 
      nrOfCard: '06', 
      title: 'Cosme de Medicis',
      description: 'Cosme de Medicis was an Italian banker and politician, the first member of the Medici political dynasty that served as de facto rulers of Florence during much of the Italian Renaissance.',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A5.jpg', 
      nrOfCard: '07', 
      title: 'Harun al Rachid',
      description: 'Harun al-Rashid was the fifth Abbasid Caliph.',
      isOpened: false
    },
    {
      url: '../../../assets/Fotos/A6.jpg', 
      nrOfCard: '08', 
      title: 'Da Vinci',
      description: 'Da Vinci was an Italian polymath of the Renaissance whose areas of interest included invention.',
      isOpened: false
    },
  ]

  constructor(
    private albumService: AlbumService,
    private imageService: ImageService,
    private dataService: DataService,
    private imagecardsService: AlbumcardsService,
    private page: PaginationService
  ) {}

  ngOnInit() {
    this.dataService.currentAlbum.subscribe(album => {
      this.rndAlbum = album;
      if (this.rndAlbum.albumUid) {
        const firstalbumcards = this.imagecardsService.getFirstNCardsForAlbum(
          // this.rndAlbum.albumUid
          'tUm1YsEHFAtck71iuFjI',
          8
        );

        firstalbumcards.get().subscribe(documentSnapshots => {
          // Get the last visible document
          this.lastCard = documentSnapshots.docs.length - 1;
        });
        this.imageService
          .getNCardsForAlbum(firstalbumcards)
          .subscribe(images => {
            if (images.length === 0) {
              this.endOfArray = true;
            } else {
              this.images = images;
              this.beginingOfArray = false;
            }
          });
      }
    });
  }

  next() {
    const nextAlbumCards = this.imagecardsService.getNextNCards(
      // this.rndAlbum.albumUid,
      'tUm1YsEHFAtck71iuFjI',
      this.lastCard
    );
    nextAlbumCards.get().subscribe(
      documentSnapshots =>
        // Get the last visible document
        (this.lastCard = documentSnapshots.docs.length - 1)
    );
    this.imageService.getNCardsForAlbum(nextAlbumCards).subscribe(images => {
      if (images.length === 0) {
        this.endOfArray = true;
      } else {
        this.images = images;
        this.endOfArray = false;
      }
    });
  }

  previouse() {
    this.lastCard -= 8;
    const previouseAlbumCards = this.imagecardsService.getNextNCards(
      // this.rndAlbum.albumUid,
      'tUm1YsEHFAtck71iuFjI',
      this.lastCard
    );
    previouseAlbumCards.get().subscribe(
      documentSnapshots =>
        // Get the last visible document
        (this.lastCard = documentSnapshots.docs.length - 1)
    );
    this.imageService
      .getNCardsForAlbum(previouseAlbumCards)
      .subscribe(images => {
        if (images.length === 0) {
          this.beginingOfArray = true;
        } else {
          this.images = images;
          this.beginingOfArray = false;
        }
      });
  }

  iconClicked() {
    this.showDesc = !this.showDesc;
  }

  openDescription(card) {
    card.isOpened = !card.isOpened;
  }

  setIndex1(i) {
    this.clicked = !this.clicked;

    // tslint:disable-next-line:curly
    if (this.clicked) this.selectedIndex = i + 8;

    // tslint:disable-next-line:curly
    if (!this.clicked) this.selectedIndex = null;
  }
}

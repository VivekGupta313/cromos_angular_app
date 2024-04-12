import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ModalService} from 'src/app/services/modal.service';
import {DataService} from 'src/app/services/data/data.service';
import {Album} from 'src/app/models/album';
import { DndDropEvent } from 'ngx-drag-drop';
import { AlbumcardsService } from '../../services/albumcards/albumcards.service';
import { ImageService } from '../../services/image/image.service';
import { AuthService } from '../../services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-album-single-open',
  templateUrl: './album-single-open.component.html',
  styleUrls: ['./album-single-open.component.scss'],
})
export class AlbumSingleOpenComponent implements OnInit {
  album$: any;
  albumSingle: Album;
  testImage: any;
  card = {url: '../../../assets/Fotos/A1.jpg', nrOfCard: '01'};
  cards = [
    {url: '../../../assets/Fotos/A1.jpg', nrOfCard: '01'},
    {url: '../../../assets/Fotos/A10.jpg', nrOfCard: '02'},
    {url: '../../../assets/Fotos/A101.jpg', nrOfCard: '03'},
    {url: '../../../assets/Fotos/A102.jpg', nrOfCard: '04'},
    {url: '../../../assets/Fotos/A103.jpg', nrOfCard: '05'},
    {url: '../../../assets/Fotos/A104.jpg', nrOfCard: '06'},
  ];
  currentPage: number = 1;
  minimum: number = 1;
  maximum: number = 8;
  numbers: any = [];
  myCards: any = [];
  myPlacedCards: any = [];
  myPlacedCardsId : any = [];
  albumId: any;
  albumCards: any = [];
  newAlbumCards:any =[];
  displayCards: any = [];
  newDisplayCards: any = [];
  userEmail: string ;
  group: Group ;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private albumCardsService: AlbumcardsService,
    private auth: AuthService,
    private groupService : GroupService ,
    private dataService: DataService,
    private imageService:ImageService
  ) {
    this.albumId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.formNumbers();
    this.album$ = this.dataService.currentAlbum;
    this.getCards();
    this.getAlbumCards().then(data => {
      this.albumCards.forEach((element,index)=>{
        this.getAlbumCard(element.imageUid,index);
        
      })
      
    });
    this.auth.getLoggedInUser()
    .then(data => {
      this.userEmail = data.email;
      this.getGroupId();
    })
    
  }

  getGroupId(){
    this.groupService.getAllAssociatedGroups(this.albumId).subscribe(
      (groups: Group[]) => {
        console.log("group is ") ; 
        console.log(groups) ;
        for(let i = 0 ; i < groups.length ; i++ ){
          for(let j = 0 ; j < groups[i].users.length ; j++ ){
            if(this.userEmail == groups[i].users[j]){
              console.log("group found for user "+this.userEmail) ; 
              console.log(groups[i]) ; 
              this.group  = groups[i] ; 
              break ; 
            }
          }
        }
      }
    );
  }

  async getCards() {
    try {
      let user = await this.auth.getLoggedInUser();
      this.myCards = await this.albumCardsService.getMyCards(this.albumId, user.uid);
      this.myPlacedCards = await this.albumCardsService.getMyCardsPlaced(this.albumId, user.uid);
      for(var i=0 ; i < this.myPlacedCards.length ; i++){
        let found = false ; 
        for(let j =  0 ; j < this.myCards.length ; j++){
          if(this.myCards[j].cardNumber == this.myPlacedCards[i].cardNumber){
            found = true ; 
          }
        }
        if(!found){
          this.myPlacedCardsId.push(this.myPlacedCards[i].cardNumber) ; 
        }
        
      }
      // console.log("myPlacedCards numbers") ; 
      // console.log(this.myPlacedCardsId) ;
      
      // console.log("displayed carsd") ; 
      // console.log(this.displayCards) ; 
      

    } catch(e) {

    }
  }

  async getAlbumCards() {
    try {
      this.albumCards = await this.albumCardsService.list(this.albumId);
    } catch(e) {
      
    }
  }
  async getAlbumCard(imageUid,index){
    try {
      const card  = await this.albumCardsService.cardListlist(imageUid);
      this.newAlbumCards.push(card);
      if(index == this.albumCards.length-1){
        this.displayCardsByPage();
      }
    } catch(e) {
      
    }
  }
  openDescription(card) {
    card.isOpened = !card.isOpened;
  }

  displayCardsByPage() {

    this.albumCards.map(card=>{
      this.displayCards.map(displayCard=>{
          if(card.nrOfCard == displayCard.cardNumber){
           displayCard.imageUid = card.imageUid;
          }
      })
      
    })
    if(this.newAlbumCards.length) {
        this.displayCards.map( card => {  
         
          if(card.imageUid != undefined){
        this.newAlbumCards.map(album =>{
            if(album[0].imageUid === card.imageUid) {
              card.imageUrl = album[0].imageUrl;
              card.title = album[0].title;
              card.isOpened = false;
              card.description = album[0].description;
              return card;
            }
          
        });
      }
        });
      //}

      /*
      let displayCardsCopy = this.displayCards ; 
      this.displayCards = [] ; 
      for(let i = 0 ; i < displayCardsCopy.length ; i++){
        let found = false ; 
        for(let j = 0 ; j < this.displayCards.length ; j++){
          if(displayCardsCopy[i].cardNumber == this.myCards[j].cardNumber){
            found = true ; 
          }
        }
        if(!found){
          this.displayCards.push(displayCardsCopy[i]) ; 
        }
      }

      console.log("my carsd") ; 
      console.log(this.myCards) ; */
      


    }
  }

  formNumbers() {
    this.displayCards = [];
    for(let i=this.minimum; i <= this.maximum; i++) {
      
      this.displayCards.push({cardNumber: i});
    }
  }

  previous() {
    if(this.minimum != 1) {
      if(this.minimum == 97) {
        this.minimum = 89;
        this.maximum = 96; 
      } else {
        this.minimum = this.minimum - 8;
        this.maximum = this.maximum - 8;
      }
    }
    this.formNumbers();
    this.displayCardsByPage();
  }
  
  next() {
    if(this.minimum == 89) {
      this.minimum = 97;
      this.maximum = 100;
    } else {
      if(this.maximum != 100) {
        this.minimum = this.maximum + 1;
        this.maximum = this.maximum + 8;
      }
    }

    this.formNumbers();
    this.displayCardsByPage();
  }

  dragEnd(event) {
  }

  openGroupModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'create_group'},
    });
  }

  async onDrop(event: DndDropEvent, number) {
    try {
      let index = this.displayCards.findIndex(card => card.cardNumber == event.data.cardNumber);
      if(index != -1) {
        let cardObj = {
          id: event.data.id,
          isDragged: true
        };
        await this.albumCardsService.updateUserCard(cardObj);
        await this.albumCardsService.addAlbumCard(this.albumId, event.data.imageUrl, event.data.cardNumber, event.data.title);
        
        this.displayCards[index].imageUrl = event.data.imageUrl;
        this.displayCards[index].description = event.data.description;
        let index2 = this.myCards.findIndex(card => card.id == event.data.id);
        this.myCards.splice(index2, 1);
        let card = {
          imageUrl: event.data.imageUrl,
          nrOfCard: event.data.cardNumber,
          description: event.data.description
        }
        this.albumCards.push(card);
        this.myPlacedCards.push(card);
        this.myPlacedCardsId.push(event.data.cardNumber);
      }
    } catch(e) {
    }
    // this.testImage = event.data.imageUrl;
  }

  onDragStart(event) {
  }

  openSubscriptionModal() {
    this.dataService.changeAlbum(this.album$);
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'album_subscription'},
    });
  }

  goToExchange() {
    this.router.navigateByUrl('cards-exchange');
  }

  goToAlbumOverview() {
    this.router.navigateByUrl('album-overview/'+this.group.groupUid+'/'+this.albumId);
  }

  goToRanking() {
    this.router.navigateByUrl('ranking/' + this.albumId);
  }
}

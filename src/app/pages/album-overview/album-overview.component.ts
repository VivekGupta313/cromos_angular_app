import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from 'src/app/services/user/user.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.scss'],
})
export class AlbumOverviewComponent implements OnInit {
  cards = Array.from({length: 100}, (v, k) => k+1);  
  albumUid: any;
  groupUid: any;
  userId: any;
  albumCardsArr;
  cardCntArr;
  missingCards: number = 0;
  repeatCards: number = 0;
  existingCards: number = 0;
  allowXchange: boolean = true;

  constructor(
  	private router: Router,
  	private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {
  	this.albumUid = this.activatedRoute.snapshot.params['albumUid'];
    this.groupUid = this.activatedRoute.snapshot.params['groupUid'];
  }

  ngOnInit() {
    console.log("album over view") ; 
    if(this.activatedRoute.snapshot.params['groupUid'] == "undefined") {
      this.allowXchange = false;
    } else {
      this.allowXchange = true;
    }
    this.authService.getLoggedInUser()
    .then(async userLogin => {
      this.userId = userLogin.uid;
      this.albumCardsArr = await this.userService.getUserAlbumCards(this.albumUid, this.userId);
      this.getCardCounts();
    });
  }

  checkCardExist(cardNo) {
    const found = this.albumCardsArr.some(el => el.cardNumber == cardNo);
    if(found){
      return 'number green';
    } else {
      return 'number red';
    }
  }

  openCollections() {
    this.router.navigateByUrl('collections');
  }

  openCardExchange() {
    //this.router.navigateByUrl('cards-exchange');
    this.router.navigate([`cards-exchange/${this.groupUid}/${this.albumUid}/0/0`]);
  }

  getCardCounts() {
    this.missingCards = 100 - this.albumCardsArr.length;
    this.existingCards = this.albumCardsArr.length;
    this.cardCntArr = this.cards.map(card => {
      return this.albumCardsArr.reduce((cnt, albumCard) => albumCard.cardNumber == card? ++cnt : cnt, 0);
    })
    this.repeatCards = this.cardCntArr.filter(cardCnt => cardCnt > 1).length;
  }

}

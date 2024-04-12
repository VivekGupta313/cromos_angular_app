import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from 'src/app/services/user/user.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {GroupService} from 'src/app/services/group/group.service';
import {Observable} from 'rxjs';
import {_} from 'underscore';
import {Proposal, initialProposal} from 'src/app/models/proposal';
import {CardsExchangeService} from 'src/app/services/cards-exchange.service';
import {ToastService} from 'src/app/services/toast/toast.service';

//Initial Select Object
const initialSelect = {
  selectType : '',
  selectCard : '',
  selectUser : ''
}

@Component({
  selector: 'app-cards-exchange',
  templateUrl: './cards-exchange.component.html',
  styleUrls: ['./cards-exchange.component.scss'],
})
export class CardsExchangeComponent implements OnInit {
  cards : any = Array.from({length: 100}, (v, k) => k+1);
  groupUid : any;
  albumUid : any;
  userId : any;
  albumCardsArr: any;
  cardCntArr = [];
  usersEmail = [];
  users = [];
  selected = initialSelect;
  selectedUserIdx: number;
  selectedCardIdx: number;
  hasSelected: boolean = false;
  selectCardsForDeal: boolean = false;
  cardsOpts: any;
  selectedCardData: any;
  selectedCardIdxForDeal: any = [];
  proposalDeal: any;
  
  // For Card Exchange
  isExchange: any = 0;
  proposal: any;
  requestCard: any;
  requestor = {};
  currUser: any;
  dispCards: any;
  selectedExchangeCard: any;
  selectedExchangeCardIdx : number;

  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService,
    private groupService : GroupService,
    private cardsExchangeService : CardsExchangeService,
    private toastService : ToastService
  ) {
    this.groupUid = this.activatedRoute.snapshot.params['groupUid'];
    this.albumUid = this.activatedRoute.snapshot.params['albumUid'];
    this.isExchange = this.activatedRoute.snapshot.params['type'];
  }

  ngOnInit() {
    this.authService.getLoggedInUser()
    .then(async data => {
      this.userId = data.uid;
      this.albumCardsArr = await this.userService.getUserAlbumCards(this.albumUid, this.userId);
      if(this.isExchange == 1) {
        this.userService.getUserProposalById(this.activatedRoute.snapshot.params['proposalId'])
        .then(data => {
          this.proposal = data;
          this.requestCard = this.proposal.cardNo;
          this.getRepeatCards();
          this.getUsers();
        });
      } else {
        this.getRepeatCards();
        this.getUsers();
        console.log("this.users : ", this.users)
      }
    })
  }

  navigateTo() {
    this.router.navigateByUrl('exchange-prposal');
  }

  async getRepeatCards() {
    this.cardCntArr = await this.cards.map(card => {
      return this.albumCardsArr.reduce((cnt, albumCard) => albumCard.cardNumber == card? ++cnt : cnt, 0);
    })

    this.cards = await this.cardCntArr.map((card, i) => {
      if(card > 1) {
        return i + 1;
      }
    }).filter(el => {
      return el !== undefined;
    })
    this.cards = this.getUnique(this.cards, 6);
  }

  getUnique(array, count) {
    // Make a copy of the array
    let tmp = array;
    let ret = [];

    console.log("tmp : ", tmp)

    for (let i = 0; i < count; i++) {
      let index = Math.floor(Math.random() * tmp.length);
      let removed = tmp.splice(index, 1);
      // Since we are only removing one element
      ret.push(removed[0]);
    }

    ret = ret.filter(el => {
      return el !== undefined;
    })
    console.log("ret : ", ret)
    return ret;  
  }

  async getUsers() {
    let group = await this.groupService.getGroup(this.groupUid);
    _.each(group['users'], async email => {
      //initial cards template
      let cards: any = [],
          cardCntArr: any = [];
      var tmpCards = Array.from({length: 100}, (v, k) => k+1);

      // Get User Data
      let user = await this.userService.getUserByEmail(email);

      // Get Users Cards
      cards = await this.userService.getUserAlbumCards(this.albumUid, user['uid']);

      // Get Repeated Cards
      cardCntArr = tmpCards.map(card => {
        return cards.reduce((cnt: any, c) => c['cardNumber'] == card ? ++cnt : cnt, 0);
      }).map((card, i) => {
        if(card > 1) return i + 1;
      }).filter(item => {
        return item !== undefined;
      })
      
      user['cards'] = cards;
      user['repeatedCards'] = cardCntArr;
      user['repeatNo'] = cardCntArr.length;

      if(this.isExchange == 1) {
        if(user['uid'] == this.proposal.fromUser){
          this.requestor = user;
        }
        if(user['uid'] == this.proposal.fromUser && this.proposal.type == "card"){
          _.each(this.requestor['cards'], card => {
            if(this.proposal.cardNo == card['cardNumber']) {
              this.requestCard = card;
            }
          })
        } else if(user['uid'] == this.proposal.toUser && this.proposal.type == "user"){
          let proposee = user;
          _.each(proposee['cards'], card => {
            if(this.proposal.cardNo == card['cardNumber']) {
              this.requestCard = card;
            }
          })
        }
        if(user['uid'] == this.proposal.toUser && this.proposal.type == 'card') {
          this.currUser = user;
          let repeatedCards = [];
          this.proposal.cardForDeal.map(dcard => {
            this.currUser.cards.filter(card => {
              let existFlag = repeatedCards.findIndex(card => card.cardNumber == dcard)
              if(existFlag > -1) {
                //skip
              } else {
                if(dcard == card.cardNumber) {
                  repeatedCards.push(card);
                }
              }
            })
          })
          this.dispCards = repeatedCards;
        } else if(user['uid'] == this.proposal.fromUser && this.proposal.type == 'user') {
          this.currUser = user;
          let repeatedCards = [];
          this.proposal.cardForDeal.map(dcard => {
            this.currUser.cards.filter(card => {
              let existFlag = repeatedCards.findIndex(card => card.cardNumber == dcard)
              if(existFlag > -1) {
                //skip
              } else {
                if(dcard == card.cardNumber) {
                  repeatedCards.push(card);
                }
              }
            })
          })
          this.dispCards = repeatedCards;
        }
      }
      this.users.push(user);
    });
  }

  selectUser(user: any, i) {
    if(i == this.selectedUserIdx) {
      this.selectedUserIdx = -1;
      this.selectedCardIdx = -1;
      this.hasSelected = !this.hasSelected;
      if(this.selected.selectType == 'card') {
        this.users = [];
        this.getUsers();
      } else {
        this.users = [];
        this.getUsers();
        this.cards = Array.from({length: 100}, (v, k) => k+1);
        this.getRepeatCards();
      }
      this.selected = initialSelect;
    } else {
      this.selectedUserIdx = i;
      this.selected.selectUser = user.uid;
      console.log("this.selected : ", this.selected);
      if(!this.hasSelected) {
        //set select object type to card
        this.hasSelected = true;
        //set selected object
        this.selected.selectType = 'user';
        console.log("this.selected : ", this.selected);
        console.log("first selection is user");
      } else if(this.hasSelected && this.selected.selectType == 'user') {
        this.selected = initialSelect;
        this.hasSelected = !this.hasSelected;
        console.log("this.selected : ", this.selected);
      }
    }
    // filter 
    if(this.selected.selectType == 'user'){
      console.log("user.repeatedCards : ", user.repeatedCards);
      this.cards = this.getUnique(user.repeatedCards, 6);
    }
  }

  selectCard(card, i) {
    if(i == this.selectedCardIdx) {
      this.selectedCardIdx = -1;
      this.selectedUserIdx = -1;
      this.hasSelected = !this.hasSelected;
      if(this.selected.selectType == 'card') {
        this.users = [];
        this.getUsers();
      } else {
        this.users = [];
        this.getUsers();
        this.cards = Array.from({length: 100}, (v, k) => k+1);
        this.getRepeatCards();
      }
      this.selected = initialSelect;
    } else {
      this.selectedCardIdx = i;
      this.selected.selectCard = card;
      console.log("this.selected : ", this.selected);
      if(!this.hasSelected) {
        //set select object type to card
        this.hasSelected = true;
        //set selected object
        this.selected.selectType = 'card';
        console.log("this.selected : ", this.selected);
        console.log("first selection is card");
      } else if(this.hasSelected && this.selected.selectType == 'card') {
        this.selected = initialSelect;
        this.hasSelected = !this.hasSelected;
        console.log("this.selected : ", this.selected);
      }
    }
    // filter
    if(this.selected.selectType == 'card' && this.hasSelected) {
      this.users = _.filter(this.users, user => {
        if(user.repeatedCards.includes(card)) {
          console.log('has the selected card', user)
          return user;
        }
      })
    }
  }

  nextStep() {
    this.selectCardsForDeal = true;
    this.proposalDeal = initialProposal;
    this.proposalDeal.cardNo = this.selected.selectCard;
    this.proposalDeal.groupUid = this.groupUid;
    this.proposalDeal.albumUid = this.albumUid;
    this.proposalDeal.fromUser = this.userId,
    this.proposalDeal.toUser = this.selected.selectUser;
    this.proposalDeal.type = this.selected.selectType;

    if(this.proposalDeal.type == 'card') {
      // display repeated cards of toUser
      let userCards: any = [];
      
      this.users.forEach(user => {
        if(user.uid == this.proposalDeal.toUser) {
          user.repeatedCards.forEach(rCard => {
            user.cards.forEach(card => {
              let existFlag = userCards.findIndex(card => card.cardNumber == rCard)
              if(existFlag > -1) {
                //skip
              } else {
                if(rCard == card.cardNumber) {
                  userCards.push(card);
                }
              }
            })
          })
        }
      })
      this.cardsOpts = this.getUnique(userCards, 6);

      //set selected card image (fromUser)
      this.users.forEach(user => {
        if(user.uid == this.proposalDeal.fromUser) {
          user.cards.forEach(card => {
            if (card.cardNumber == this.proposalDeal.cardNo) {
              this.selectedCardData = card;
            }
          })
        }
      })

    } else {
      // display selected cards of fromUser
      let userCards: any = [];
      
      this.users.forEach(user => {
        if(user.uid == this.proposalDeal.fromUser) {
          user.repeatedCards.forEach(rCard => {
            user.cards.forEach(card => {
              let existFlag = userCards.findIndex(card => card.cardNumber == rCard)
              if(existFlag > -1) {
                //skip
              } else {
                if(rCard == card.cardNumber) {
                  userCards.push(card);
                }
              }
            })
          })
        }
      })
      this.cardsOpts = this.getUnique(userCards, 6);

      //set selected card image (toUser)
      this.users.forEach(user => {
        if(user.uid == this.proposalDeal.toUser) {
          user.cards.forEach(card => {
            if (card.cardNumber == this.proposalDeal.cardNo) {
              this.selectedCardData = card;
            }
          })
        }
      })
    }
  }

  selectDealCard(card, i) {
    if(this.selectedCardIdxForDeal.includes(i)) {
      this.selectedCardIdxForDeal = this.selectedCardIdxForDeal.filter(val => {return val != i});
      this.proposalDeal.cardForDeal = this.proposalDeal.cardForDeal.filter(val => {return val != card.cardNumber}); 
    } else {
      this.selectedCardIdxForDeal.push(i);
      this.proposalDeal.cardForDeal.push(card.cardNumber);
    }
  }

  isDealCardSelected(cardIdx) {
    return this.selectedCardIdxForDeal.includes(cardIdx);
  }

  sendProposal() {

    if(this.proposalDeal.cardForDeal.length != 0) {
      this.cardsExchangeService.addProposal(this.proposalDeal)
      .then(() => {
        this.router.navigate([`album/${this.albumUid}`]);
        this.toastService.newToast({content: 'Proposal is sent', style: 'success'})
      }).catch(err => {
        this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
      })
    } else {
      this.toastService.newToast({content: 'Please select a card for deal', style: 'warning'})
    }
  }

  getCardImage(card, isRequestCard) {
    let style: any = {};
    if(isRequestCard) {
      return style = {
        'background-image' : "url(" + card.imageUrl + ")",
        'background-size' : "cover"
      }
      return style;
    } else {
      var url: string = '';
      _.each(this.currUser.cards, cardItem => {
        if(cardItem.cardNumber == card) {
          url = cardItem.imageUrl;
        }
      })
      return style = {
        'background-image' : "url(" + url + ")",
        'background-size' : "cover"
      }
    }
  }

  getCardIdXchange(cardNo) {
    let card = _.filter(this.currUser.cards, card => {
      if(card.cardNumber == cardNo) {
        return card;
      }
    })

    return card[0].id;
  }

  acceptExchange() {

    console.log("this.proposal : ", this.proposal)
    console.log("this.requestCard : ", this.requestCard)
    if(this.proposal.type == 'card') {
      // change requestCard userID to toUser
      this.cardsExchangeService.updateCard(this.requestCard.id, this.proposal.toUser)
      .then(data => {
        console.log("RequestCard update success");
      }).catch(err => {
        this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
      })
    } else {
      // change requestCard userID to fromUser
      this.cardsExchangeService.updateCard(this.requestCard.id, this.proposal.fromUser)
      .then(data => {
        console.log("RequestCard update success");
      }).catch(err => {
        this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
      })
    }

    //update userID of selectedExchangeCard to fromUser 
    if(this.proposal.type == 'card') {
      // change requestCard userID to fromUser
      this.proposal.cardForDeal.forEach(card => {
        let c_id = this.getCardIdXchange(card);
        this.cardsExchangeService.updateCard(c_id, this.proposal.fromUser)
        .then(data => {
          console.log("selectedExchangeCard update success");
        }).catch(err => {
          this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
        })
      })
    } else {
      // change requestCard userID to toUser
      this.proposal.cardForDeal.forEach(card => {
        let c_id = this.getCardIdXchange(card);
        this.cardsExchangeService.updateCard(c_id, this.proposal.toUser)
        .then(data => {
          console.log("selectedExchangeCard update success");
        }).catch(err => {
          this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
        })
      })
    }

    // update proposal
    this.cardsExchangeService.updateProposal(this.proposal.proposalUid)
    .then(() => {
      this.toastService.newToast({content: 'Exchange success', style: 'success'})
      this.router.navigate([`album/${this.albumUid}`])
    }).catch(err => {
      this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
    })

  }

}

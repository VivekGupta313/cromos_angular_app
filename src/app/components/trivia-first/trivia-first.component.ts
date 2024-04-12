import {Component, OnInit, Input} from '@angular/core';
import {ModalService} from 'src/app/services/modal.service';
import { UserService } from '../../services/user/user.service';
import { ImageService } from '../../services/image/image.service';
import { UserCard } from '../../models/usercards';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-trivia-first',
  templateUrl: './trivia-first.component.html',
  styleUrls: ['./trivia-first.component.scss'],
})
export class TriviaFirstComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  @Input() data;
  // cards = [
  //   {
  //     url:
  //       'https://firebasestorage.googleapis.com/v0/b/chromos-cc861.appspot.com/o/images%2Fmissing_image.png?alt=media&token=2d234416-5d7b-4ef3-82d7-7970d4729e89',
  //     nrOfCard: 1,
  //   },
  //   // tslint:disable-next-line:max-line-length
  //   {
  //     url:
  //       'https://firebasestorage.googleapis.com/v0/b/chromos-cc861.appspot.com/o/images%2FGeo07.jpg?alt=media&token=b751fe63-04b8-4be6-b47f-815e67c1df30',
  //     nrOfCard: 4,
  //   },
  //   {
  //     url:
  //       'https://firebasestorage.googleapis.com/v0/b/chromos-cc861.appspot.com/o/images%2Fmissing_image.png?alt=media&token=43126c5c-44d0-4afd-af3a-73471b9c1472',
  //     nrOfCard: 7,
  //   },
  // ];
  cards: any = [];
  constructor(private modalService: ModalService, 
    private imageService: ImageService,
    private authService: AuthService,
    private userService: UserService) {}

  async ngOnInit() {
    await this.updateVisit();
    this.getRandomCards();
  }

  async updateVisit() {
    try {
      let user = await this.userService.getProfile();
      if(this.data.userAlbumIndex == 0 ){
        user['album_one_lastVisit'] = new Date().getTime();
        user['album_one_points'] += 3;
      } else if(this.data.userAlbumIndex == 1 ){
        user['album_two_lastVisit'] = new Date().getTime();
        user['album_two_points'] += 3;
      } else if(this.data.userAlbumIndex == 2 ){
        user['album_three_lastVisit'] = new Date().getTime();
        user['album_three_points'] += 3;
      }
  
      await this.userService.updateProfile(user);

    } catch(e) {
    }
  }

  openModal(modalType) {
    console.log("first");
    this.modalService.modalShow({
      modalShow: true,
      modalData: this.data.album,
      modalContent: {modalType: modalType},
    });
  }
  
  async getRandomCards() {
    let user = await this.authService.getLoggedInUser();
    console.log('hgey user', user);
    try {
      this.cards = await this.imageService.list();
      this.cards = this.imageService.getRandomImages(this.cards, 3);
      this.cards = this.cards.map(card => {
        card.nrOfCard = Math.floor((Math.random() * 100) + 1);
        return card;
      })
      console.log('cards', this.cards);

      this.cards.map(async(card) => {
        console.log('card test', card);
        let cardObj:UserCard = {
          imageUrl: card.url,
          receivedDate: new Date().getTime(),
          albumUid: this.data.album.albumUid,
          userUid: user['uid'],
          cardNumber: card.nrOfCard,
          title: card.title,
          imageUId: card.imageUid,
          isDragged: false,
          description: card.description
        }
        await this.userService.addUserCard(cardObj);
      })
    } catch(e) {
      console.log('error diri', e);
    }
  }

  getRandomNumber() {

  }
}
